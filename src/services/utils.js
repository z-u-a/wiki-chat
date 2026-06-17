import crypto from 'crypto';

export function createArticleId(url) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
}
