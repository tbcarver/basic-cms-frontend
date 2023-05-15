/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import strapiApiService from "~/services/strapiApiService";
import * as cheerio from 'cheerio';


(async () => {
  const classNames: Set<string> = new Set();
  const pages = await strapiApiService.getPages();
  const slugs = pages.map((page) => page.attributes.slug);

  for (const slug of slugs) {
    const page = await strapiApiService.getPage(slug);

    if (page.meta.pagination.total !== 0 && page.data[0]) {
      const strapiPage = page.data[0];
      setClassNames(classNames, strapiPage.attributes.content);
    }
  }

  console.log(Array.from(classNames));
});

function setClassNames(classNames: Set<string>, content: string) {
  const $ = cheerio.load(content);

  $('[class]').each(function(this: cheerio.Cheerio) {
    const classes = ($(this).attr('class')?.split(' ') || []) as string[];
    classes.forEach(className => classNames.add(className));
  });
}
