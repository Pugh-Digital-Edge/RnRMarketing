const form = document.querySelector<HTMLFormElement>('[data-checklist-form]');
if (form) {
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const status = form.querySelector<HTMLElement>('[data-checklist-status]')!;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    status.textContent = 'Opening your checklist…';
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => { if (typeof value === 'string') body.append(key, value); });
    try {
      const response = await fetch('/.netlify/functions/submit-checklist', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body,
      });
      if (!response.ok) throw new Error('Unable to submit');
      try { sessionStorage.setItem('ai_checklist_submission_pending', '1'); } catch { /* Download still works without storage. */ }
      window.location.assign(form.action);
    } catch {
      status.textContent = 'We couldn’t open the checklist. Please try again; your email is still here.';
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  });
}
