import { submission } from '$lib/utilities';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
    const result = await submission({
        method: 'GET',
        endpoint: '/subcriteriaassignments/my-evaluation-periods',
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!result.ok) throw error(result.data.status, result.data.message);

    return {
        periods: result.data || []
    };
};