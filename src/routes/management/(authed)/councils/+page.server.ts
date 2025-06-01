import { submission } from '$lib/utilities';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    const councils = await submission({ 
        method: 'GET', 
        endpoint: `/reviewcouncil`, 
        cookies, 
        unauthorizedPath: url.pathname 
    });

    return {
        data: councils.data
    };
};