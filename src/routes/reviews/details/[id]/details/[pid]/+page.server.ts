import { submission } from '$lib/utilities';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
    const parentCriteriaResult = await submission({
        method: 'GET',
        endpoint: `/parentcriterias/${params.pid}`,
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!parentCriteriaResult.ok) {
        throw error(parentCriteriaResult.data.status, parentCriteriaResult.data.message);
    }

    return {
        parentCriteria: parentCriteriaResult.data,
        subCriterias: parentCriteriaResult.data.subCriterias || [],
        evaluationId: params.id
    };
};