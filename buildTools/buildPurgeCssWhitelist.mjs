import dotenv from 'dotenv';
import cheerio from 'cheerio';
import fs from 'fs';
import url from 'url';
import path from 'path';

dotenv.config();

(async () => {
  const classNames = new Set();

  const contentTypes = ['pages', 'components'];
  for (const contentType of contentTypes) {
    const collection = await fetchCollection(contentType);
    extractClassNames(classNames, collection);
  }

  const whitelist = Array.from(classNames);
  console.log(whitelist);

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const tailwindConfigPath = path.resolve(__dirname, '../tailwind.config.ts');
  const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, 'utf8');

  let lines = tailwindConfigContent.split('\n');
  const whitelistLineIndex = lines.findIndex(line => line.trim().startsWith('safelist:'));

  lines[whitelistLineIndex] = `      safelist: ${JSON.stringify(whitelist)},`;
  fs.writeFileSync('./tailwind.config.ts', lines.join('\n'));

  console.log('Updated tailwind.config.ts file with the purge whitelist');
})();

async function fetchCollection(contentType) {
  const query = 'pagination[limit]=100&fields=id,name,content';
  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${contentType}?${query}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching ${contentType}: ${response.statusText}`);
  }

  // TODO: handle more than 100 results

  const strapiResponse = await response.json();
  return strapiResponse.data;
}

function extractClassNames(classNames, collection) {
  for (const item of collection) {
    if (item?.attributes?.content) {
      setClassNames(classNames, item.attributes.content);
    }
  }
}

function setClassNames(classNames, content) {
  const $ = cheerio.load(content);

  for (const elem of $('[class]')) {
    const classes = $(elem).attr('class')?.split(' ') || [];
    classes.forEach(className => classNames.add(className));
  }
}
