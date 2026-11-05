/** Public audit UI. Job credentials live in this tab's memory only. */
type Evidence = { url: string; text: string };
type Category = { id: string; label: string; score: number | null; summary: string };
type Check = { id: string; category: string; label: string; status: "pass" | "fail" | "unknown"; evidence: Evidence[]; recommendation: string };
type Fix = { title: string; why: string; action: string; evidence: Evidence[] };
export type AuditReport = { version: 1; url: string; service: string; area: string; generatedAt: string; score: number | null; categories: Category[]; checks: Check[]; fixes: Fix[]; pages: { url: string; status: "checked" | "unavailable"; reason?: string }[]; limitations: string[] };
type Job = { jobId: string; accessToken: string };
type JobResponse = Partial<Job> & { status?: "queued" | "running" | "complete" | "failed"; cached?: boolean; report?: unknown; message?: string; error?: string };
type Fixture = { url: string; label: string; service: string; area: string };
type Config = { enabled: boolean; reportEnabled: boolean; botSiteKey?: string; mode: "disabled" | "live" | "local"; localPreview?: boolean; fixtures?: Fixture[]; csrfToken?: string; message?: string };
type BotOptions = { sitekey: string; action: string; size: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void };
type BotAPI = { render: (container: HTMLElement, options: BotOptions) => string; reset: (id: string) => void; remove?: (id: string) => void };
type AuditWindow = Window & { turnstile?: BotAPI; rrAuditBotReady?: () => void; rrAuditReportLink?: { jobId: string; accessToken: string } };

const AUDIT_ENDPOINT = "/.netlify/functions/website-audit";
const REPORT_ENDPOINT = "/.netlify/functions/audit-report";
const MAX_POLL_ATTEMPTS = 24;
const POLL_DEADLINE_MS = 120_000;
const LOCAL_BOT_TOKEN = "local-preview";
const PUBLIC_PREVIEW_NOTICE = "Preview only. No website will be scanned and no email address is collected. Live scanning and email delivery are not available yet.";

/** A server flag alone must never enable the local bypass on a public hostname. */
export function isTrustedLocalPreview(hostname: string, value: unknown): boolean {
  const config = objectValue(value);
  return ["localhost", "127.0.0.1", "[::1]"].includes(hostname) && config.mode === "local" && config.localPreview === true && config.enabled === true;
}

export function localReportHref(value: unknown, origin: string): string | null {
  if (typeof value !== "string" || value.length > 2048 || !value.trim()) return null;
  try {
    const url = new URL(value, origin);
    return url.origin === origin && !url.username && !url.password && /^\/__audit-preview\/outbox\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname) && !url.search && !url.hash ? url.pathname : null;
  } catch { return null; }
}

function previewFixtures(value: unknown): Fixture[] {
  return arrayValue(value, 20).flatMap(item => {
    const fixture = objectValue(item);
    try {
      const url = new URL(stringValue(fixture.url, 2048));
      const label = stringValue(fixture.label, 160), service = stringValue(fixture.service, 160), area = stringValue(fixture.area, 120);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || !label || !service || area.length < 2) return [];
      return [{ url: url.href, label, service, area }];
    } catch { return []; }
  });
}

export function normalizeAuditUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2048) throw new Error("Enter your public website homepage.");
  let url: URL;
  try { url = new URL(/^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`); }
  catch { throw new Error("Enter a valid website address, such as https://yourcompany.com."); }
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".") || url.username || url.password) {
    throw new Error("Enter a public HTTP or HTTPS website without a username or password.");
  }
  url.hash = "";
  return url.href;
}

/** Retry-After can be an HTTP date or seconds. Never poll before the server asks. */
export function auditRetryDelay(value: string | null, now = Date.now()): number {
  if (!value) return 2500;
  if (/^\d+(?:\.\d+)?$/.test(value.trim())) return Math.max(1000, Number(value) * 1000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(1000, date - now) : 2500;
}

function stringValue(value: unknown, max = 4000): string { return typeof value === "string" ? value.slice(0, max) : ""; }
function objectValue(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function scoreValue(value: unknown): number | null { return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : null; }
function arrayValue(value: unknown, max: number): unknown[] { return Array.isArray(value) ? value.slice(0, max) : []; }
function evidenceValue(value: unknown): Evidence[] { return arrayValue(value, 8).map(item => { const entry = objectValue(item); return { url: stringValue(entry.url, 2048), text: stringValue(entry.text, 1800) }; }); }

export function parseAuditReport(value: unknown): AuditReport {
  const report = objectValue(value);
  if (report.version !== 1 || typeof report.url !== "string" || !Array.isArray(report.checks) || !Array.isArray(report.categories) || !Array.isArray(report.fixes) || !Array.isArray(report.pages)) {
    throw new Error("The scanner returned an incomplete report. Please try checking its status again.");
  }
  return {
    version: 1, url: stringValue(report.url, 2048), service: stringValue(report.service, 160), area: stringValue(report.area, 160), generatedAt: stringValue(report.generatedAt, 80), score: scoreValue(report.score),
    categories: arrayValue(report.categories, 12).map(item => { const category = objectValue(item); return { id: stringValue(category.id, 100), label: stringValue(category.label, 180), score: scoreValue(category.score), summary: stringValue(category.summary) }; }),
    checks: arrayValue(report.checks, 80).map(item => { const check = objectValue(item); return { id: stringValue(check.id, 100), category: stringValue(check.category, 100), label: stringValue(check.label, 250), status: check.status === "pass" || check.status === "fail" ? check.status : "unknown", evidence: evidenceValue(check.evidence), recommendation: stringValue(check.recommendation) }; }),
    fixes: arrayValue(report.fixes, 3).map(item => { const fix = objectValue(item); return { title: stringValue(fix.title, 250), why: stringValue(fix.why), action: stringValue(fix.action), evidence: evidenceValue(fix.evidence) }; }),
    pages: arrayValue(report.pages, 15).map(item => { const page = objectValue(item); return { url: stringValue(page.url, 2048), status: page.status === "checked" ? "checked" : "unavailable", reason: stringValue(page.reason, 1200) }; }),
    limitations: arrayValue(report.limitations, 20).map(item => stringValue(item, 1600)),
  };
}

/** Intentionally fixed fictional content: never substituted with visitor input. */
export const sampleAuditReport: AuditReport = {
  version: 1, url: "https://example.test/", service: "water damage restoration", area: "Example City, FL", generatedAt: "", score: 69,
  categories: [
    { id: "mobile-contact", label: "Mobile contact HTML", score: 50, summary: "1 of 2 checked HTML signals passed. 1 could not be checked." },
    { id: "service-location", label: "Service & location clarity", score: 50, summary: "1 of 2 checked HTML signals passed." },
    { id: "trust", label: "Visible trust cues", score: 100, summary: "1 of 1 checked HTML signals passed. 1 could not be checked." },
    { id: "search-technical", label: "Basic search signals", score: 75, summary: "3 of 4 checked HTML signals passed." },
  ],
  checks: [
    { id: "tap-to-call", category: "mobile-contact", label: "Telephone link present", status: "fail", evidence: [{ url: "https://example.test/", text: "Fictional HTML includes a phone number as plain text, with no tel: link." }], recommendation: "Make the published business phone number a tel: link so a visitor can open their calling app." },
    { id: "viewport", category: "mobile-contact", label: "Device-width viewport declared", status: "pass", evidence: [{ url: "https://example.test/", text: "Fictional HTML contains a viewport meta tag with width=device-width." }], recommendation: "This HTML signal is present. A real-device review is still needed to assess the mobile experience." },
    { id: "contact-route", category: "mobile-contact", label: "Contact route present", status: "unknown", evidence: [{ url: "https://example.test/contact/", text: "The contact page is intentionally unavailable in this fictional example." }], recommendation: "Review the contact route manually; this report cannot judge a page it did not inspect." },
    { id: "service-clarity", category: "service-location", label: "Selected service named in page text", status: "pass", evidence: [{ url: "https://example.test/", text: "Fictional homepage heading: Water Damage Restoration." }], recommendation: "Keep the service description specific and useful for property owners." },
    { id: "area-clarity", category: "service-location", label: "Selected area named in page text", status: "fail", evidence: [{ url: "https://example.test/", text: "Example City is not named in this fictional homepage text." }], recommendation: "State the actual city or service area in useful page text. Confirm the business truly serves that area before adding it." },
    { id: "company-information", category: "trust", label: "Company information present", status: "pass", evidence: [{ url: "https://example.test/", text: "Fictional homepage includes an About Our Team section." }], recommendation: "Keep company information accurate. Text presence does not independently verify business identity." },
    { id: "trust-cues", category: "trust", label: "Trust wording present", status: "unknown", evidence: [{ url: "https://example.test/contact/", text: "Some sample page HTML is unavailable, so trust wording cannot be fully checked." }], recommendation: "Review the site's credentials, experience, and customer evidence manually; verify accuracy before publication." },
    { id: "https", category: "search-technical", label: "Homepage served over HTTPS", status: "pass", evidence: [{ url: "https://example.test/", text: "The fictional homepage address uses HTTPS." }], recommendation: "An HTTPS connection is one signal; it is not a full security assessment." },
    { id: "page-title", category: "search-technical", label: "Homepage title present", status: "fail", evidence: [{ url: "https://example.test/", text: "The fictional homepage HTML has no nonempty title element." }], recommendation: "Give the homepage a clear, accurate title identifying the business and primary offering." },
    { id: "primary-heading", category: "search-technical", label: "Homepage primary heading present", status: "pass", evidence: [{ url: "https://example.test/", text: "Fictional HTML H1: Water Damage Restoration." }], recommendation: "Keep the heading clear and useful. Its visual presentation is unverified." },
    { id: "indexing-directive", category: "search-technical", label: "No homepage noindex directive observed", status: "pass", evidence: [{ url: "https://example.test/", text: "No noindex directive is included in the fictional homepage metadata." }], recommendation: "Verify actual indexing with the owner's search data; this HTML signal does not establish visibility." },
  ],
  fixes: [
    { title: "Make the phone number a direct next step.", why: "A property owner dealing with water damage needs a clear way to reach your team.", action: "Add a tel: link to the existing business number and use clear emergency-contact wording where it accurately reflects your availability.", evidence: [{ url: "https://example.test/", text: "Sample finding: a plain-text phone number has no click-to-call link." }] },
    { title: "Explain where your team works.", why: "Property owners need to know whether the business serves their area.", action: "If the business serves Example City, add useful, accurate service-area information to the homepage.", evidence: [{ url: "https://example.test/", text: "Sample finding: the selected service area is not named in the homepage text." }] },
    { title: "Give the homepage a useful title.", why: "The document title helps identify the page in browser tabs and other contexts.", action: "Add a concise title that accurately identifies the business and its primary offering.", evidence: [{ url: "https://example.test/", text: "Sample finding: the homepage title element is empty or absent." }] },
  ],
  pages: [{ url: "https://example.test/", status: "checked" }, { url: "https://example.test/contact/", status: "unavailable", reason: "Intentionally unavailable in this fictional sample." }],
  limitations: ["This entire report is fictional and demonstrates the format. No website was requested or scanned.", "An HTML check cannot establish whether a design looks good, works on a real mobile device, or converts visitors.", "Rankings, Google Business Profile, analytics, Core Web Vitals, and lead quality are not measured.", "Unknown checks are excluded from scoring. A limited set of public pages does not represent every page on a website."],
};

class AuditRequestError extends Error {
  constructor(message: string, public retryAfter = 0, public retryable = false) { super(message); }
}

export function setupWebsiteAudit(root: ParentNode = document) {
  const app = root.querySelector<HTMLElement>("[data-website-audit]");
  if (!app || app.dataset.auditManaged === "true") return;
  app.dataset.auditManaged = "true";
  const get = <T extends HTMLElement>(selector: string) => {
    const element = app.querySelector<T>(selector);
    if (!element) throw new Error(`Missing audit element: ${selector}`);
    return element;
  };
  const form = get<HTMLFormElement>("[data-audit-form]");
  const scanButton = get<HTMLButtonElement>("[data-audit-submit]");
  const availability = get("[data-audit-availability]");
  const error = get("[data-audit-error]");
  const urlInput = get<HTMLInputElement>("#audit-url");
  const serviceInput = get<HTMLSelectElement>("#audit-service");
  const areaInput = get<HTMLInputElement>("#audit-area");
  const fixtureInput = get<HTMLSelectElement>("[data-audit-fixture]");
  const progress = get("[data-audit-progress]");
  const progressTitle = get("#audit-progress-title");
  const progressText = get("[data-audit-progress-text]");
  const resume = get("[data-audit-resume]");
  const resumeText = get("[data-audit-resume-text]");
  const resumeButton = get<HTMLButtonElement>("[data-audit-check-again]");
  const reportPanel = get("[data-audit-report]");
  const reportHeading = get("#audit-report-title");
  const emailForm = get<HTMLFormElement>("[data-audit-email-form]");
  const emailButton = get<HTMLButtonElement>("[data-audit-email-submit]");
  const emailStatus = get("[data-audit-email-status]");
  const emailError = get("[data-audit-email-error]");
  const scanBot = get("[data-audit-bot='scan']");
  const reportBot = get("[data-audit-bot='report']");
  const browser = window as AuditWindow;
  let initialReportLink = browser.rrAuditReportLink;
  delete browser.rrAuditReportLink;
  let config: Config = { enabled: false, reportEnabled: false, mode: "disabled" };
  let job: Job | null = null;
  let scanBusy = false;
  let emailBusy = false;
  let showingSample = false;
  let emailDelivered = false;
  let sequence = 0;
  let requestController: AbortController | null = null;
  let pollingTimer: number | undefined;
  let retryTimer: number | undefined;
  let cooldownTimer: number | undefined;
  let scanReadyAt = 0;
  let resumeAt = 0;
  let scanToken = "";
  let reportToken = "";
  let scanWidget: string | undefined;
  let reportWidget: string | undefined;
  let botLoading: Promise<void> | undefined;

  const node = <K extends keyof HTMLElementTagNameMap>(tag: K, text = "", className = "") => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const showError = (element: HTMLElement, message = "") => { element.textContent = message; element.hidden = !message; };
  const localMode = () => config.mode === "local";
  const postHeaders = (): Record<string, string> => ({ "Content-Type": "application/json", ...(localMode() && config.csrfToken ? { "X-Audit-Preview-CSRF": config.csrfToken } : {}) });
  const selectedFixture = () => config.fixtures?.[Number(fixtureInput.value)];
  const updateButtons = () => {
    scanButton.disabled = !config.enabled || !scanToken || scanBusy || Date.now() < scanReadyAt || (localMode() && !selectedFixture());
    emailButton.disabled = showingSample || !job || !config.reportEnabled || !reportToken || emailBusy || emailDelivered;
  };
  const resetBot = (kind: "scan" | "report") => {
    const id = kind === "scan" ? scanWidget : reportWidget;
    const token = localMode() ? LOCAL_BOT_TOKEN : "";
    if (kind === "scan") scanToken = token; else reportToken = token;
    if (id !== undefined) { try { browser.turnstile?.reset(id); } catch { /* Expired widgets remain disabled. */ } }
    updateButtons();
  };
  const stopPolling = () => {
    sequence += 1;
    requestController?.abort();
    requestController = null;
    if (pollingTimer !== undefined) window.clearTimeout(pollingTimer);
    pollingTimer = undefined;
    scanBusy = false;
    progress.hidden = true;
    progress.setAttribute("aria-busy", "false");
    updateButtons();
  };
  const focusReport = () => { reportPanel.scrollIntoView({ behavior: "auto", block: "start" }); reportHeading.focus({ preventScroll: true }); };
  const safeLink = (url: string) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol) && !parsed.username && !parsed.password ? parsed.href : null;
    } catch { return null; }
  };
  const evidenceList = (items: Evidence[]) => {
    const list = node("ul", "", "wa-evidence");
    for (const item of items) {
      const li = node("li", item.text);
      const source = node("span", "", "wa-evidence-source");
      const href = safeLink(item.url);
      if (href && !showingSample && !localMode()) {
        const link = node("a", item.url);
        link.href = href; link.target = "_blank"; link.rel = "noopener noreferrer";
        source.append(link);
      } else source.textContent = item.url;
      li.append(source); list.append(li);
    }
    return list;
  };

  const loadBot = (): Promise<void> => {
    if (browser.turnstile) return Promise.resolve();
    if (botLoading) return botLoading;
    botLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timeout = window.setTimeout(() => { reject(new Error("The security check did not load. Allow the verification script and reload to try again.")); }, 15_000);
      browser.rrAuditBotReady = () => { window.clearTimeout(timeout); resolve(); };
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=rrAuditBotReady&render=explicit";
      script.async = true; script.defer = true;
      script.onerror = () => { window.clearTimeout(timeout); reject(new Error("The security check could not load. Reload to try again.")); };
      document.head.append(script);
    });
    return botLoading;
  };
  const mountBot = async (kind: "scan" | "report") => {
    if (localMode()) { resetBot(kind); return; }
    if (!config.enabled || !config.botSiteKey || (kind === "report" && (!config.reportEnabled || showingSample))) return;
    const container = kind === "scan" ? scanBot : reportBot;
    if ((kind === "scan" ? scanWidget : reportWidget) !== undefined) return;
    container.hidden = false;
    try {
      await loadBot();
      if (!config.enabled || (kind === "report" && showingSample)) return;
      const widget = browser.turnstile?.render(container, {
        sitekey: config.botSiteKey, action: kind === "scan" ? "website_audit" : "audit_report", size: container.clientWidth > 0 && container.clientWidth < 300 ? "compact" : "flexible",
        callback(token) { if (kind === "scan") scanToken = token; else reportToken = token; updateButtons(); },
        "expired-callback"() { resetBot(kind); showError(kind === "scan" ? error : emailError, "The security check expired. Complete the new check to continue."); },
        "error-callback"() { if (kind === "scan") scanToken = ""; else reportToken = ""; showError(kind === "scan" ? error : emailError, "The security check could not complete. Reload this page to try again."); updateButtons(); },
      });
      if (kind === "scan") scanWidget = widget; else reportWidget = widget;
    } catch (cause) { showError(kind === "scan" ? error : emailError, cause instanceof Error ? cause.message : "The security check is unavailable."); }
  };

  const renderReport = (report: AuditReport, sample: boolean) => {
    showingSample = sample;
    emailDelivered = false;
    reportPanel.hidden = false;
    reportHeading.textContent = sample ? "Sample website snapshot." : localMode() ? "Local fixture website snapshot." : "Your website snapshot.";
    get("#audit-email-title").textContent = sample || !config.reportEnabled ? "About report delivery." : localMode() ? "Keep a local report copy." : "Send the report to your inbox.";
    get("[data-report-kind]").textContent = sample ? "Sample report / fictional website" : localMode() ? "Local fixture scan / actual HTML" : "Website audit / public HTML";
    get("[data-report-demo]").hidden = !sample;
    get("[data-report-local]").hidden = sample || !localMode();
    const date = report.generatedAt ? new Date(report.generatedAt) : null;
    get("[data-report-context]").textContent = [report.url, `${report.service} · ${report.area}`, date && !Number.isNaN(date.valueOf()) ? `Checked ${date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}` : ""].filter(Boolean).join("\n");
    get("[data-report-score]").textContent = report.score === null ? "—" : String(report.score);
    const checked = report.checks.filter(check => check.status !== "unknown").length;
    const unknown = report.checks.length - checked;
    get("[data-report-score-caption]").textContent = report.score === null ? "Not enough evidence to score." : `${checked} checks assessed · ${unknown} unknown`;
    const categories = get("[data-report-categories]"); categories.replaceChildren();
    for (const category of report.categories) {
      const article = node("article", "", "wa-category");
      const heading = node("div", "", "wa-category-heading");
      heading.append(node("h3", category.label), node("span", category.score === null ? "Unknown" : String(category.score), "wa-category-score"));
      const bar = node("div", "", "wa-category-bar"); bar.setAttribute("aria-hidden", "true");
      const fill = node("span"); fill.style.width = `${category.score ?? 0}%`; bar.append(fill);
      article.append(heading, node("p", category.summary), bar); categories.append(article);
    }
    const fixes = get("[data-report-fixes]"); fixes.replaceChildren();
    report.fixes.forEach((fix, index) => {
      const item = node("li", "", "wa-fix");
      item.append(node("span", String(index + 1).padStart(2, "0"), "wa-fix-number"), node("h4", fix.title), node("p", fix.why), node("p", fix.action, "wa-fix-action"), evidenceList(fix.evidence));
      fixes.append(item);
    });
    const checks = get("[data-report-checks]"); checks.replaceChildren();
    for (const check of report.checks) {
      const detail = node("details", "", "wa-check");
      const summary = node("summary");
      const state = check.status === "pass" ? "Present" : check.status === "fail" ? "Opportunity" : "Unknown";
      summary.append(node("span", state, `wa-check-state wa-state-${check.status}`), node("span", check.label));
      const body = node("div", "", "wa-check-body");
      body.append(node("p", check.recommendation), evidenceList(check.evidence)); detail.append(summary, body); checks.append(detail);
    }
    const pages = get("[data-report-pages]"); pages.replaceChildren();
    for (const page of report.pages) pages.append(node("li", `${page.status === "checked" ? "Checked" : "Unavailable"} — ${page.url}${page.reason ? `: ${page.reason}` : ""}`));
    const limitations = get("[data-report-limitations]"); limitations.replaceChildren();
    for (const limitation of report.limitations) limitations.append(node("li", limitation));
    emailStatus.textContent = ""; showError(emailError);
    emailForm.hidden = sample || !config.reportEnabled;
    get("[data-report-delivery-note]").textContent = sample ? "Report delivery is unavailable for the sample. No email address is needed to explore it." : localMode() ? config.reportEnabled ? "Save this report to the local outbox to test the complete workflow. No email is sent and no HubSpot contact is created." : "Local report saving is not available in this setup. Your report is still available above." : config.reportEnabled ? "Get a copy of this report by email. Marketing updates are a separate, optional choice." : "Email delivery is not available in this setup. Your report is still available above.";
    resetBot("report"); updateButtons();
    if (!sample && config.reportEnabled) void mountBot("report");
    focusReport();
  };

  const request = async <T>(url: string, options: RequestInit = {}, ownController?: AbortController, timeoutMs = 20_000): Promise<{ data: T; retryAfter: number }> => {
    const controller = ownController ?? new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, credentials: "same-origin", cache: "no-store", signal: controller.signal });
      let data: unknown;
      try { data = await response.json(); } catch { throw new AuditRequestError("The audit service did not return a usable response. Please try again."); }
      const delay = auditRetryDelay(response.headers.get("Retry-After"));
      if (!response.ok) {
        const body = objectValue(data);
        const message = stringValue(body.message, 600) || stringValue(body.error, 600) || "The audit service is unavailable. Please try again later.";
        throw new AuditRequestError(message, response.headers.has("Retry-After") ? delay : 0, response.status === 429 || response.status === 503);
      }
      return { data: data as T, retryAfter: delay };
    } finally { window.clearTimeout(timeout); }
  };
  const pauseWithJob = (message: string, delay = 0) => {
    stopPolling();
    resume.hidden = false;
    resumeButton.hidden = !job;
    resumeAt = Date.now() + delay;
    resumeText.textContent = message;
    resumeButton.disabled = delay > 0;
    if (retryTimer !== undefined) window.clearTimeout(retryTimer);
    if (delay > 0) retryTimer = window.setTimeout(() => { resumeButton.disabled = false; }, Math.min(delay, 2_147_483_647));
  };
  const setPhase = (status: "queued" | "running", delay: number) => {
    progressTitle.textContent = status === "queued" ? "Your scan is queued." : localMode() ? "Checking the fixture website." : "Checking your public pages.";
    const message = status === "queued" ? "Waiting for an available scanner." : localMode() ? "Reading included fixture HTML and collecting evidence on this machine." : "Reading public HTML and collecting evidence. Some pages may be unavailable.";
    const wait = delay > 3000 ? ` Next status check in ${Math.ceil(delay / 1000)} seconds.` : "";
    if (progressText.textContent !== message + wait) progressText.textContent = message + wait;
  };
  const pollJob = async (currentSequence: number, started: number, attempt = 0) => {
    if (!job || currentSequence !== sequence) return;
    if (attempt >= MAX_POLL_ATTEMPTS || Date.now() - started >= POLL_DEADLINE_MS) {
      pauseWithJob("This scan is taking longer than expected. Automatic checks have stopped. You can check its status again."); return;
    }
    requestController = new AbortController();
    try {
      const { data, retryAfter } = await request<JobResponse>(`${AUDIT_ENDPOINT}?jobId=${encodeURIComponent(job.jobId)}`, { headers: { Authorization: `Bearer ${job.accessToken}` } }, requestController);
      if (currentSequence !== sequence) return;
      if (data.status === "complete" && data.report) { const report = parseAuditReport(data.report); stopPolling(); resume.hidden = true; renderReport(report, false); return; }
      if (data.status === "failed") { stopPolling(); job = null; showError(error, data.message || data.error || "The scanner could not complete this website check. Try again or review the sample."); return; }
      if (data.status !== "queued" && data.status !== "running") throw new AuditRequestError("The scanner returned an unexpected status. You can check again.");
      setPhase(data.status, retryAfter);
      if (Date.now() - started + retryAfter >= POLL_DEADLINE_MS) { pauseWithJob(`The scanner asked us to wait ${Math.ceil(retryAfter / 1000)} seconds. Automatic checks have paused.`, retryAfter); return; }
      pollingTimer = window.setTimeout(() => { void pollJob(currentSequence, started, attempt + 1); }, retryAfter);
    } catch (cause) {
      if (currentSequence !== sequence) return;
      const message = cause instanceof Error && cause.name === "AbortError" ? "The status check timed out. Your scan may still be processing." : cause instanceof Error ? cause.message : "We could not check this scan's status.";
      const delay = cause instanceof AuditRequestError ? cause.retryAfter : 0;
      pauseWithJob(message + (delay ? ` Wait ${Math.ceil(delay / 1000)} seconds before checking again.` : " You can check its status again."), delay);
    }
  };
  const beginPolling = (delay = 0) => {
    stopPolling();
    resume.hidden = true; progress.hidden = false; progress.setAttribute("aria-busy", "true"); scanBusy = true; updateButtons();
    const currentSequence = sequence;
    const started = Date.now();
    if (delay >= POLL_DEADLINE_MS) { pauseWithJob(`The scanner asked us to wait ${Math.ceil(delay / 1000)} seconds before checking again.`, delay); return; }
    pollingTimer = window.setTimeout(() => { void pollJob(currentSequence, started); }, delay);
  };

  get<HTMLButtonElement>("[data-audit-sample]").addEventListener("click", () => {
    initialReportLink = undefined; stopPolling(); job = null; resume.hidden = true; showError(error); renderReport(sampleAuditReport, true);
  });
  get<HTMLButtonElement>("[data-audit-stop]").addEventListener("click", () => {
    pauseWithJob("Automatic status checks are paused. Your scan may continue on the server; check again when you are ready.");
    if (job) resumeButton.focus();
  });
  resumeButton.addEventListener("click", () => { if (job && Date.now() >= resumeAt) beginPolling(); });
  const applyFixture = () => {
    const fixture = selectedFixture();
    if (!fixture) return;
    urlInput.value = fixture.url;
    if (![...serviceInput.options].some(option => option.value === fixture.service)) {
      const option = node("option", fixture.service); option.value = fixture.service; serviceInput.append(option);
    }
    serviceInput.value = fixture.service; areaInput.value = fixture.area;
    showError(error); urlInput.removeAttribute("aria-invalid"); urlInput.removeAttribute("aria-errormessage"); updateButtons();
  };
  fixtureInput.addEventListener("change", applyFixture);
  urlInput.addEventListener("input", () => { urlInput.removeAttribute("aria-invalid"); urlInput.removeAttribute("aria-errormessage"); showError(error); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (scanBusy || !config.enabled || !scanToken || Date.now() < scanReadyAt || !form.reportValidity()) return;
    let url: string;
    try {
      if (localMode()) {
        const fixture = selectedFixture();
        if (!fixture || urlInput.value !== fixture.url) throw new Error("Choose an included preview website. Other addresses cannot be scanned in local preview.");
        url = fixture.url;
      } else url = normalizeAuditUrl(urlInput.value);
    }
    catch (cause) { showError(error, cause instanceof Error ? cause.message : "Enter a valid website URL."); urlInput.setAttribute("aria-invalid", "true"); urlInput.setAttribute("aria-errormessage", "audit-client-error"); error.id = "audit-client-error"; urlInput.focus(); return; }
    stopPolling(); job = null; scanBusy = true; showingSample = false; reportPanel.hidden = true; resume.hidden = true; showError(error); showError(emailError); emailStatus.textContent = ""; emailForm.hidden = true;
    const token = scanToken;
    updateButtons(); scanButton.firstElementChild!.textContent = "Starting website check…";
    progress.hidden = false; progress.setAttribute("aria-busy", "true"); progressTitle.textContent = localMode() ? "Starting the local fixture scan." : "Starting your website check."; progressText.textContent = localMode() ? "Sending the selected fixture and service details to the local scanner." : "Sending your website and service details to the scanner.";
    const currentSequence = sequence;
    requestController = new AbortController();
    try {
      const values = new FormData(form);
      const { data, retryAfter } = await request<JobResponse>(AUDIT_ENDPOINT, { method: "POST", headers: postHeaders(), body: JSON.stringify({ url, service: String(values.get("service") || ""), area: String(values.get("area") || "").trim(), botToken: token }) }, requestController);
      if (currentSequence !== sequence) return;
      if (typeof data.jobId !== "string" || typeof data.accessToken !== "string") throw new AuditRequestError("The scanner did not provide a job receipt. Please try again.");
      job = { jobId: data.jobId, accessToken: data.accessToken };
      if (data.status === "complete" && data.report) { const report = parseAuditReport(data.report); stopPolling(); renderReport(report, false); }
      else if (data.status === "queued" || data.status === "running") { setPhase(data.status, retryAfter); beginPolling(retryAfter); }
      else throw new AuditRequestError(data.message || data.error || "The website check could not start. Please try again later.");
    } catch (cause) {
      if (currentSequence !== sequence) return;
      stopPolling();
      const message = cause instanceof Error && cause.name === "AbortError" ? "The request timed out. No report is available in this tab. Try again later or explore the sample." : cause instanceof Error ? cause.message : "The scanner is unavailable. Please try again later.";
      const delay = cause instanceof AuditRequestError ? cause.retryAfter : 0;
      showError(error, message + (delay ? ` Please wait ${Math.ceil(delay / 1000)} seconds before trying again.` : ""));
      if (delay > 0) { scanReadyAt = Date.now() + delay; if (cooldownTimer !== undefined) window.clearTimeout(cooldownTimer); cooldownTimer = window.setTimeout(updateButtons, Math.min(delay, 2_147_483_647)); }
      if (job) pauseWithJob("A scan receipt was received, but its report could not be displayed. You can check the status again.", delay);
    } finally {
      scanButton.firstElementChild!.textContent = localMode() ? "Scan fixture website" : config.enabled ? "Check my website" : "Live scanning unavailable";
      resetBot("scan");
    }
  });
  emailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (emailBusy || emailDelivered || showingSample || !job || !config.reportEnabled || !reportToken || !emailForm.reportValidity()) return;
    emailBusy = true; updateButtons(); showError(emailError); emailStatus.textContent = localMode() ? "Saving your report locally…" : "Sending your report…";
    const values = new FormData(emailForm);
    const sentJob = job;
    const currentSequence = sequence;
    try {
      const { data } = await request<{ delivered?: boolean; previewSaved?: boolean; previewReportUrl?: string; message?: string }>(REPORT_ENDPOINT, { method: "POST", headers: postHeaders(), body: JSON.stringify({ ...sentJob, email: String(values.get("email") || "").trim(), marketingConsent: !localMode() && values.get("marketingConsent") === "on", botToken: reportToken }) }, undefined, 45_000);
      if (currentSequence !== sequence || showingSample || job !== sentJob) return;
      if (localMode()) {
        const href = localReportHref(data.previewReportUrl, browser.location.origin);
        if (data.previewSaved !== true || !href) throw new AuditRequestError("A local report save was not confirmed. No email was sent. Please try again later.");
        emailStatus.textContent = "Saved locally; no email sent. ";
        const link = node("a", "Open local report"); link.href = href; emailStatus.append(link);
      } else {
        if (data.delivered !== true || data.previewSaved === true) throw new AuditRequestError(data.previewSaved === true ? "The service returned a local preview receipt. Email delivery was not confirmed." : data.message || "Report delivery was not confirmed. Please try again later.");
        emailStatus.textContent = "Your report was accepted for delivery. Check your inbox, including spam or promotions.";
      }
      emailDelivered = true; emailForm.hidden = true;
    } catch (cause) {
      if (currentSequence !== sequence || showingSample || job !== sentJob) return;
      emailStatus.textContent = "";
      const ambiguous = cause instanceof Error && cause.name === "AbortError";
      showError(emailError, ambiguous ? localMode() ? "The local save request timed out. Check the local outbox before submitting again. No email was sent." : "The delivery request timed out, so delivery is unconfirmed. Check your inbox before submitting again." : cause instanceof Error ? cause.message : localMode() ? "The local save could not be confirmed. No email was sent." : "Report delivery could not be confirmed. Please try again later.");
    } finally { emailBusy = false; resetBot("report"); }
  });

  const loadConfiguration = async () => {
    // Begin with the same held state as the static HTML, including failed config requests.
    get("[data-audit-form-title]").textContent = "Preview the website audit.";
    get("[data-audit-form-copy]").textContent = "Explore a fictional report. Live scanning and email delivery are not available yet.";
    get("[data-audit-intro-note]").textContent = "Preview only. No website is scanned and no email is collected.";
    availability.textContent = PUBLIC_PREVIEW_NOTICE;
    scanButton.firstElementChild!.textContent = "Live scanning unavailable";
    urlInput.disabled = true; serviceInput.disabled = true; areaInput.disabled = true;
    updateButtons();
    try {
      const { data } = await request<Config>(AUDIT_ENDPOINT);
      if (isTrustedLocalPreview(browser.location.hostname, data)) {
        config = { enabled: true, reportEnabled: data.reportEnabled === true, mode: "local", localPreview: true, fixtures: previewFixtures(data.fixtures), csrfToken: stringValue(data.csrfToken, 500) };
        get("[data-audit-local-banner]").hidden = false;
        get("[data-audit-fixture-field]").hidden = false;
        get("[data-audit-form-title]").textContent = "Try a local fixture website.";
        get("[data-audit-form-copy]").textContent = "Choose an included website, then run the real HTML scanner on this machine.";
        get("[data-audit-lede]").textContent = "Run the HTML scanner on an included restoration website, then review its evidence and practical next steps locally.";
        get("[data-audit-panel-eyebrow]").textContent = "Fixture website / local preview";
        get("[data-audit-intro-note]").textContent = "Local fixture scans. Optional local report saving. No external delivery.";
        get("[data-audit-url-label]").textContent = "Included fixture homepage";
        get("#audit-url-help").textContent = "Only the included fixture websites are available. This address is set by your selection.";
        urlInput.readOnly = true; urlInput.autocomplete = "off";
        fixtureInput.replaceChildren();
        config.fixtures!.forEach((fixture, index) => { const option = node("option", fixture.label); option.value = String(index); fixtureInput.append(option); });
        fixtureInput.value = "0"; applyFixture();
        get("#audit-email-title").textContent = "Keep a local report copy.";
        get("[data-audit-email-label]").textContent = "Test email address (local record only)";
        get<HTMLInputElement>("#audit-email").placeholder = "owner@example.test";
        get("[data-audit-marketing-field]").hidden = true;
        get<HTMLInputElement>("#audit-marketing").disabled = true;
        get("[data-audit-email-privacy]").hidden = true;
        get("[data-audit-local-delivery-help]").hidden = false;
        get("[data-audit-email-button-label]").textContent = "Save report locally";
        scanButton.firstElementChild!.textContent = "Scan fixture website";
        scanBot.hidden = true; reportBot.hidden = true;
        availability.textContent = config.fixtures!.length ? "Ready to scan an included fixture locally. No security widget or external provider is used." : "No preview fixtures are available. You can still explore the fictional sample.";
      } else {
        config = { enabled: data.enabled === true && data.mode === "live" && typeof data.botSiteKey === "string" && !!data.botSiteKey.trim(), reportEnabled: data.mode === "live" && data.reportEnabled === true, mode: data.mode === "live" ? "live" : "disabled", botSiteKey: data.mode === "live" && typeof data.botSiteKey === "string" ? data.botSiteKey : undefined };
        availability.textContent = data.mode === "local" ? `Local preview is unavailable on this address. Use the local preview server on localhost. ${PUBLIC_PREVIEW_NOTICE}` : config.enabled ? "Complete the security check, then start your audit. No email required." : PUBLIC_PREVIEW_NOTICE;
        if (config.enabled) {
          get("[data-audit-form-title]").textContent = "Start with your homepage.";
          get("[data-audit-form-copy]").textContent = "Add one core service and the area you want to reach.";
          get("[data-audit-lede]").textContent = "Is your website giving a property owner a clear next step? Check the signals that help people find your restoration company and get in touch.";
          get("[data-audit-panel-eyebrow]").textContent = "Your website / first look";
          get("[data-audit-intro-note]").textContent = config.reportEnabled ? "See your results first. Email is optional." : "See your results here. Email delivery is not available in this setup.";
          get("#audit-url-help").textContent = "A public website you own or are authorized to review.";
          scanButton.firstElementChild!.textContent = "Check my website";
        }
      }
      if (config.enabled) { urlInput.disabled = false; serviceInput.disabled = false; areaInput.disabled = false; await mountBot("scan"); }
    } catch { availability.textContent = PUBLIC_PREVIEW_NOTICE; }
    updateButtons();
    const reportLink = initialReportLink;
    initialReportLink = undefined;
    if (reportLink) {
      if (!config.enabled) { showError(error, "This report link cannot be opened while live scanning is unavailable. Try again when the service is available."); return; }
      job = reportLink; showingSample = false; reportPanel.hidden = true;
      setPhase("running", 0); progressText.textContent = "Opening the report from your private link.";
      beginPolling();
    }
  };
  window.addEventListener("pagehide", () => { stopPolling(); if (retryTimer !== undefined) window.clearTimeout(retryTimer); if (cooldownTimer !== undefined) window.clearTimeout(cooldownTimer); }, { once: true });
  void loadConfiguration();
}
