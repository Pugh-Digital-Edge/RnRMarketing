// Shared offer language for the website, paid landing page, and sales materials.
export const offer = {
  name: 'R&R Restoration Growth System',
  session: 'Lead Flow Acceleration Session',
  checklist: 'AI Visibility Checklist for Restoration Companies',
  checklistPath: '/resources/ai-visibility-checklist/',
  checklistDownload: '/downloads/restoration-ai-visibility-checklist.pdf',
  summary: 'One managed program connecting your website, paid search and Local Services Ads, local SEO and Google Business Profile, AI visibility, and lead tracking.',
  territory: 'We partner with one restoration company per agreed service territory, subject to availability.',
  investment: 'Typical total marketing budgets range from $2,500 to $10,000 per month, including management and ad spend. Your proposal separates the management fee from the advertising budget for your market.',
  commitment: 'Start with a three-month commitment, then continue month to month. Cancellation requires 30 days’ written notice and takes effect at the end of the applicable billing period; partial months are not prorated.',
  ownership: 'Yes. After completing your three-month commitment and paying your balance, we transfer your website, graphics, and content at no extra charge. Early-transfer and hosting details are covered in your agreement.',
  timing: 'Paid campaigns can begin producing qualified leads within 72 hours of launch, depending on market, budget, eligibility, and campaign readiness. Organic search and AI visibility take longer. Rankings, leads, and AI citations are not guaranteed.',
  takeaway: 'Leave with our AI visibility checklist and a clearer sense of what to prioritize, even if we don’t work together.',
};

export const programServices = [
  { title: 'Your website', text: 'A website built and maintained around your services, territory, and the next step a property owner needs to take.' },
  { title: 'Paid search + Local Services Ads', text: 'Campaign planning and management guided by your service territory, eligibility, advertising budget, and actual lead quality.' },
  { title: 'Local SEO + Google Business Profile', text: 'Service pages, local business information, and Google Business Profile work that help property owners find and evaluate you in Search and Maps.' },
  { title: 'AI visibility + AEO', text: 'Clear, useful service content and technical access that help answer engines understand your company. We monitor mentions and citations without promising placement.' },
  { title: 'Lead tracking', text: 'Connect calls and forms to their marketing source, then use your team’s job outcomes to understand which opportunities become booked work.' },
];

export const offerFaqs = [
  { question: 'How much does the program cost?', answer: offer.investment },
  { question: 'What is the minimum commitment?', answer: offer.commitment },
  { question: 'What does exclusive territory mean?', answer: `${offer.territory} We manage your marketing as your agency partner; this is not a shared-lead package. Territory exclusivity applies to our client relationships, not a guarantee that each prospect contacts only you.` },
  { question: 'How quickly can we expect leads?', answer: offer.timing },
  { question: 'Can we keep our website if we leave?', answer: offer.ownership },
  { question: 'What happens after we submit the form?', answer: `Choose a time on the confirmation page for your free, 30-minute ${offer.session} with Matt. We review your territory, visibility, and priorities. ${offer.takeaway}` },
];
