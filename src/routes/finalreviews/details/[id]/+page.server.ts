import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const [periodResult, unitsResult, targetGroupsResult] = await Promise.all([
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
            endpoint: '/targetgroups',
            cookies
        })
    ]);

    if (!periodResult.ok) throw error(periodResult.data.status, periodResult.data.message);

    // Transform target groups by fetching full parent criteria information
    const targetGroups = await Promise.all(
        targetGroupsResult.data?.map(async (group: any) => {
            // Fetch full parent criteria information for each ID
            const parentCriteriasPromises = group.parentCriterias.map((criteriaId: number) =>
                submission({
                    method: 'GET',
                    endpoint: `/parentcriterias/${criteriaId}`,
                    cookies
                })
            );

            const parentCriteriasResults = await Promise.all(parentCriteriasPromises);
            
            // Extract successful results
            const parentCriterias = parentCriteriasResults
                .filter(result => result.ok)
                .map(result => result.data);

            return {
                ...group,
                parentCriterias
            };
        }) || []
    );

    return { 
        period: periodResult.data,
        availableUnits: unitsResult.data,
        targetGroups
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