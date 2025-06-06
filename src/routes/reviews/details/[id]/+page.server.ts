import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
    const result = await submission({
        method: 'GET',
        endpoint: '/subcriteriaassignments/my-evaluation-periods',
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!result.ok) throw error(result.data.status, result.data.message);

    // Find the specific period by ID
    const period = result.data.find((p: any) => p.id.toString() === params.id);
    
    if (!period) {
        throw error(404, 'Evaluation period not found');
    }

    return {
        period: period
    };
};