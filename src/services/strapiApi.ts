import { env } from '~/env.mjs';
import type { StrapiPage, StrapiResponse } from '~/services/strapiTypes';

const strapiApi = {
  async getPages(): Promise<StrapiPage[]> {
    const query = 'pagination[limit]=100&fields=id,slug';
    const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_API_URL}/pages?${query}`, {
      headers: {
        'Authorization': `Bearer ${env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching pages: ${response.statusText}`);
    }

    // TODO: handle more than a 100 results

    const strapiResponse = await response.json() as StrapiResponse<StrapiPage>;
    return strapiResponse.data;
  },

  async getPage(slug: string): Promise<StrapiResponse<StrapiPage>> {
    const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_API_URL}/pages?filters[slug][$eq]=${slug}`, {
      headers: {
        'Authorization': `Bearer ${env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching page: ${response.statusText}`);
    }

    const strapiResponse = await response.json() as StrapiResponse<StrapiPage>;
    return strapiResponse;
  },
}

export default strapiApi;
