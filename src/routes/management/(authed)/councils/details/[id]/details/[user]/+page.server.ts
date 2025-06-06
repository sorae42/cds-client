import { submission } from '$lib/utilities';
import { fail, json } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const [assignments, units] = await Promise.all([
        submission({
            method: 'GET',
            endpoint: `/reviewcouncil/view?reviewerId=${params.user}`,
            cookies
        }),
        submission({
            method: 'GET',
            endpoint: '/units',
            cookies
        })
    ]);

    // Fetch scored assignments for each unit and merge into units array
    const unitsWithScoredAssignments = await Promise.all(
        units.data.map(async (unit: any) => {
            const scoredAssignmentsResult = await submission({
                method: 'GET',
                endpoint: `/subcriteriaassignments/scored?unitId=${unit.id}`,
                cookies
            });
            
            return {
                ...unit,
                scoredAssignments: scoredAssignmentsResult.ok ? scoredAssignmentsResult.data : []
            };
        })
    );

    return {
        reviewer: params.user,
        assignments: assignments.data || [],
        units: unitsWithScoredAssignments
    };
};

export const actions = {
    assign: async ({ request, cookies, params }) => {
        const data = await request.formData();
        console.log(data);

        const reviewerId = Number(params.user);
        const unitId = Number(data.get('unitId'));
        const subCriteriaId = Number(data.get('subCriteriaId'));

        const result = await submission({
            method: 'POST',
            endpoint: '/reviewcouncil/assign',
            cookies,
            form: {
                reviewerId,
                assignments: [
                    {
                        unitId,
                        subCriteriaIds: [subCriteriaId]
                    }
                ]
            },
            formType: 'obj'
        });

        if (!result.ok) {
            return fail(result.data.status, { error: result.data.message });
        }

        return { success: true, data: result.data.data };
    },

    // New action to fetch sub-criteria by unit
    fetchSubCriterias: async ({ request, cookies }) => {
        const data = await request.formData();
        const unitId = data.get('unitId')?.toString();

        if (!unitId) return fail(400, { error: 'Unit ID is required' });

        const result = await submission({
            method: 'GET',
            endpoint: `/subcriterias/by-unit?unitId=${unitId}`,
            cookies
        });

        if (!result.ok) return fail(result.data.status, { error: result.data.message });

        return result.data; // Just return the data directly
    }
} satisfies Actions;