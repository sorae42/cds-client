import { submission } from '$lib/utilities';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
    const result = await submission({ method: 'GET', endpoint: '/units/', cookies, unauthorizedPath: url.pathname })
    return {
        data: result.data
    };
};
