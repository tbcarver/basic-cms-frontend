import { type GetStaticPropsContext, type NextPage } from "next";
import ReactMarkdown from 'react-markdown';
import strapiApi from "~/services/strapiApi";
import type { StrapiPage } from "~/services/strapiTypes";
import OneColumnLayout from "~/components/oneColumnLayout";

function IndexPage({ strapiPage }: { strapiPage: StrapiPage }) {
  if (!strapiPage) {
    return (
      <OneColumnLayout>
        <p>Loading...</p>
      </OneColumnLayout>
    );
  }

  const { content, metaTitle, metaDescription } = strapiPage.attributes;

  return (
    <OneColumnLayout metaTitle={metaTitle} metaDescription={metaDescription}>
      <div className="prose lg:prose-base max-w-none">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
    </OneColumnLayout>
  );
}

export async function getStaticPaths() {
  console.log('getStaticPaths');
  const pages = await strapiApi.getPages();
  const paths = pages.map((page) => ({ params: { slug: [page.attributes.slug] } }));

  console.log(JSON.stringify(paths));
  return { paths, fallback: true };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  console.log('getStaticProps');
  const { slug: slugArray } = context.params as { slug: string[] };
  const slug = slugArray.join('/');
  const page = await strapiApi.getPage(slug);

  console.log(slug);
  // console.log(page);
  if (page.meta.pagination.total === 0) {
    return { notFound: true };
  }

  if (page.data?.length !== 1) {
    throw new Error(`Did not find exactly 1 page for slug: ${slug}`);
  }

  return { props: { strapiPage: page.data[0] } };
}

export default IndexPage as NextPage;
