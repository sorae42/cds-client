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
            endpoint: '/units/' + params.unitid,
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
            // Fetch full parent criteria information for each group
            const groupDetail = await submission({
                method: 'GET',
                endpoint: `/targetgroups/${group.id}`,
                cookies
            });
            
            return groupDetail.ok ? groupDetail.data : group;
        }) || []
    );
    
    return {
        period: periodResult.data,
        availableUnits: unitsResult.data,
        targetGroups: targetGroups || [],
    };
};

export const actions = {
    updatePeriodCriterias: async ({ request, cookies, params }) => {
        const data = await request.formData();
        const criteriaIds = data.getAll('criteriaIds[]').map(id => Number(id));

        // Get current period data to preserve other fields
        const periodResult = await submission({
            method: 'GET',
            endpoint: '/evaluationperiods/' + params.id,
            cookies
        });

        if (!periodResult.ok) {
            return fail(periodResult.data.status, { error: periodResult.data.message });
        }

        const currentPeriod = periodResult.data;

        const result = await submission({
            method: 'PUT',
            endpoint: `/evaluationperiods/${params.id}`,
            cookies,
            form: {
                name: currentPeriod.name,
                startDate: currentPeriod.startDate,
                endDate: currentPeriod.endDate,
                unitIds: currentPeriod.units?.map((u: any) => u.id) || [],
                parentCriteriaIds: criteriaIds
            },
            formType: 'obj'
        });

        if (!result.ok) {
            return fail(result.data.status, { error: result.data.message });
        }

        return { success: true };
    }
} satisfies Actions;