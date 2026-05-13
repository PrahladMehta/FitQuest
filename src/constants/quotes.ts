export type Quote = { text: string; author?: string };

export const QUOTES: Quote[] = [
  { text: 'The pain you feel today will be the strength you feel tomorrow.' },
  { text: "Don't wish for it. Work for it." },
  {
    text: 'Discipline is choosing between what you want now and what you want most.',
    author: 'Abraham Lincoln',
  },
  { text: 'Success starts with self-discipline.' },
  { text: 'The body achieves what the mind believes.' },
  { text: 'Sweat is just fat crying.' },
  { text: 'Push yourself, because no one else is going to do it for you.' },
  { text: 'Strive for progress, not perfection.' },
  { text: 'The only bad workout is the one that didn’t happen.' },
  { text: 'Your only limit is you.' },
  { text: 'Train insane or remain the same.' },
  { text: "If it doesn't challenge you, it doesn't change you." },
];

export function pickRandomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
