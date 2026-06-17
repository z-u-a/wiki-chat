import { load } from 'cheerio';

const WIKIPEDIA_HOST = 'en.wikipedia.org';

export async function scrapeWikipediaArticle(url) {
  const parsed = new URL(url);
  if (parsed.host !== WIKIPEDIA_HOST) {
    throw new Error('Only en.wikipedia.org URLs are supported');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to fetch article: ${response.status}`);
  }

  const html = await response.text();
  const $ = load(html);
  const title = $('#firstHeading').text().trim();
  const content = $('#mw-content-text');

  const paragraphs = [];
  content.find('p').each((_, el) => {
    const text = $(el).text().trim();
    if (text) paragraphs.push(text);
  });

  const sections = [];
  content.find('h2, h3').each((_, el) => {
    const heading = $(el).find('.mw-headline').text().trim();
    if (heading) sections.push(heading);
  });

  const references = [];
  content.find('.references li').each((_, el) => {
    const refText = $(el).text().trim();
    if (refText) references.push(refText);
  });

  const text = paragraphs.join('\n\n');
  return { title, text, sections, references };
}
