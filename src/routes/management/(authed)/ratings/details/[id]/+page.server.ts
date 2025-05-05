import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const [periodResult, unitsResult, criteriasResult] = await Promise.all([
        submission({
            method: 'GET',
            endpoint: '/evaluationperiods/' + params.id,
            cookies
        }),
        submission({
            method: 'GET',
            endpoint: '/units',
            cookies
        }),
        submission({
            method: 'GET', 
            endpoint: '/parentcriterias',
            cookies
        })
    ]);

    if (!periodResult.ok) throw error(periodResult.data.status, periodResult.data.message);

    return { 
        period: periodResult.data,
        availableUnits: unitsResult.data,
        availableCriterias: criteriasResult.data
    };
};

export const actions = {
    updateUnits: async ({ request, cookies, params }) => {
        const data = await request.formData();
        const unitIds = data.getAll('unitIds[]').map(id => Number(id));
        const existingIds = JSON.parse(data.get('existingIds')?.toString() || '[]');
        
        const form = new URLSearchParams();
        const combinedIds = [...new Set([...existingIds, ...unitIds])];
        
        const result = await submission({
            method: 'PUT',
            endpoint: `/evaluationperiods/${params.id}`,
            cookies,
            form: { unitIds: combinedIds },
            formType: 'obj'
        });

        if (!result.ok) return fail(result.data.status, { error: result.data.message });
        return { success: true };
    },

    updateCriterias: async ({ request, cookies, params }) => {
        const data = await request.formData();
        const criteriaIds = data.getAll('criteriaIds[]').map(id => Number(id));
        const existingIds = JSON.parse(data.get('existingIds')?.toString() || '[]');
        
        const combinedIds = [...new Set([...existingIds, ...criteriaIds])];

        const result = await submission({
            method: 'PUT',
            endpoint: `/evaluationperiods/${params.id}`,
            cookies,
            form: { parentCriteriaIds: combinedIds },
            formType: 'obj'
        });

        if (!result.ok) return fail(result.data.status, { error: result.data.message });
        return { success: true };
    }
} satisfies Actions;