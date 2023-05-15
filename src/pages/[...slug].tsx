import { type GetStaticPropsContext, type NextPage } from "next";
import { Helmet } from "react-helmet";
import { marked } from "marked";
import strapiApiService from "~/services/strapiApiService";
import type { StrapiPage } from "~/services/strapiTypes";

function SlugPage({ strapiPage, strapiComponents }: {
  strapiPage: StrapiPage,
  strapiComponents: { [key: string]: string }
}) {
  if (!strapiPage) {
    return (
      <p>Loading...</p>
    );
  }

  const { content, metaTitle, metaDescription } = strapiPage.attributes;
  const { navbar, footer } = strapiComponents;
  const convertedContent = marked(content, { mangle: false, headerIds: false });

  return (
    <>
      <Helmet>
        {metaTitle && <title>{metaTitle}</title>}
        {metaDescription && <meta name="description" content={metaDescription} />}
      </Helmet>
      {navbar && <div dangerouslySetInnerHTML={{ __html: navbar }} />}
      <div dangerouslySetInnerHTML={{ __html: convertedContent }} />
      {footer && <div dangerouslySetInnerHTML={{ __html: footer }} />}
    </>
  );
}

export async function getStaticPaths() {
  const pages = await strapiApiService.getPages();
  const paths = pages
    .filter((page) => page.attributes.slug !== 'index')
    .map((page) => ({
      params: { slug: [page.attributes.slug] },
    }));

  console.log(`Slugs: ${JSON.stringify(paths)}`);
  return { paths, fallback: true };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const strapiComponents: { [key: string]: string } = {};
  const components = await strapiApiService.getComponents();
  for (const component of components) {
    strapiComponents[component.attributes.name] = component.attributes.content;
  }

  const { slug: slugArray } = context.params as { slug: string[] };
  const slug = slugArray.join('/');
  const page = await strapiApiService.getPage(slug);

  if (page.meta.pagination.total === 0) {
    return { notFound: true };
  }

  if (page.data?.length !== 1) {
    throw new Error(`Did not find exactly 1 page for slug: ${slug}`);
  }

  return { props: { strapiPage: page.data[0], strapiComponents } };
}

export default SlugPage as NextPage;
