import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const [periodResult, unitsResult] = await Promise.all([
        submission({
            method: 'GET',
            endpoint: '/evaluationperiods/' + params.id,
            cookies
        }),
        submission({
            method: 'GET',
            endpoint: '/units',
            cookies
        })
    ]);

    if (!periodResult.ok) throw error(periodResult.data.status, periodResult.data.message);
    
    return {
        period: periodResult.data,
        availableUnits: unitsResult.data,
    };
};

export const actions = {
    updatePeriod: async ({ request, cookies, params }) => {
        const data = await request.formData();
        const unitIds = data.getAll('unitIds[]').map(id => Number(id));
        const criteriaIds = data.getAll('criteriaIds[]').map(id => Number(id));

        // Get current period data to preserve name, startDate, endDate
        const periodResult = await submission({
            method: 'GET',
            endpoint: '/evaluationperiods/' + params.id,
            cookies
        });

        if (!periodResult.ok) return fail(periodResult.data.status, { error: periodResult.data.message });
        const currentPeriod = periodResult.data;

        const result = await submission({
            method: 'PUT',
            endpoint: `/evaluationperiods/${params.id}`,
            cookies,
            form: {
                name: currentPeriod.name,
                startDate: currentPeriod.startDate,
                endDate: currentPeriod.endDate,
                unitIds: unitIds,
                parentCriteriaIds: criteriaIds
            },
            formType: 'obj'
        });

        if (!result.ok) return fail(result.data.status, { error: result.data.message });
        return { success: true };
    }
} satisfies Actions;