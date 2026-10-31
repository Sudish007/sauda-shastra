// THE one place the site's identity lives. Renaming the site = edit this object (and `name` in package.json,
// which a test keeps equal to `slug`). Nothing else in src/, site/ or scripts/ hard-codes these values.
export const SITE = {
  name: 'Sauda Shastra',
  hindi: 'सौदा शास्त्र',
  meaning: 'the science of the trade',
  tagline: 'Indian markets, explained for traders and investors. Sources, not tips.',
  description: 'Sauda Shastra is a free, source-verified knowledge site on intraday and options trading in Indian markets, technical analysis, playbooks, macro and events, algo trading, risk and tax, investing in India and the USA, and a ranked library of courses and books.',
  slug: 'sauda-shastra',
  basePath: '/sauda-shastra/',
  storagePrefix: 'saudashastra',
  owner: 'Sudish007',
  repo: 'https://github.com/Sudish007/sauda-shastra',
  liveUrl: 'https://sudish007.github.io/sauda-shastra/',
  lang: 'en-IN',
  timeZone: 'Asia/Kolkata',
};
