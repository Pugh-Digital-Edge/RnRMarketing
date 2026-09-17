import questions from './faqData.json';
import { offer } from './offer.js';

// Rendered FAQs and JSON-LD use the same current offer terms.
const answers = {
  'How much does restoration marketing cost?': offer.investment,
  'Do you require long-term contracts?': offer.commitment,
  'How quickly can I expect to see results?': offer.timing,
  'Who owns the website?': offer.ownership,
  'Do you work with restoration companies outside my area?': offer.territory,
  "What's included in your marketing services?": `${offer.name}: ${offer.summary} Our U.S.-based team manages the work, with scope and budget documented in your proposal.`,
};
export default questions.map(faq => ({ ...faq, answer: answers[faq.question] || faq.answer }));
