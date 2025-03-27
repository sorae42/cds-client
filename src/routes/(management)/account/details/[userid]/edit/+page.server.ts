import { submission } from '$lib/utilities';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, params, cookies }) => {
    const result = await submission({ method: 'GET', endpoint: '/users/' + params.userid, cookies, unauthorizedPath: url.pathname })

    return {
        data: result?.data
    };
};


