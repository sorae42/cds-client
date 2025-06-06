import { submission } from '$lib/utilities';
import { fail, json } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const [assignments, targetGroups, units] = await Promise.all([
        submission({
            method: 'GET',
            endpoint: `/reviewcouncil/view?reviewerId=${params.user}`,
            cookies
        }),
        submission({
            method: 'GET',
            endpoint: '/targetgroups',
            cookies
        }),
        submission({
            method: 'GET',
            endpoint: '/units',
            cookies
        })
    ]);

    // Get details for each target group
    const targetGroupsDetailed = [];
    for (const group of targetGroups.data) {
        const detail = await submission({
            method: 'GET',
            endpoint: `/targetgroups/${group.id}`,
            cookies
        });
        targetGroupsDetailed.push(detail);
    }

    // Process the detailed data
    const processedGroups = targetGroupsDetailed.map(group => {
        const data = group.data;
        data.parentCriterias.forEach((element: any, index: number, array: Array<any>) => {
            let totalScore = 0;
            for (let e of element.subCriterias) {
                totalScore += e.maxScore;
            }
            array[index].totalScore = totalScore;
        });
        return data;
    });

    // Handle the new API response structure
    // assignments.data is now directly an array of assignment objects
    const reviewerAssignments = assignments.data || [];
    
    // Create a reviewer object with the expected structure
    const reviewer = {
        reviewerId: parseInt(params.user),
        fullName: 'N/A', // This info might need to be fetched separately if needed
        username: 'N/A',  // This info might need to be fetched separately if needed
        isChair: false    // This info might need to be fetched separately if needed
    };

    return {
        reviewer,
        assignments: reviewerAssignments,
        targetGroups: processedGroups,
        units: units.data
    };
};

export const actions = {
    assign: async ({ request, cookies, params }) => {
        const data = await request.formData();
        console.log(data);

        const reviewerId = params.user;
        const unitId = Number(data.get('unitId'));
        const subCriteriaId = Number(data.get('subCriteriaId'));

        const result = await submission({
            method: 'POST',
            endpoint: '/reviewcouncil/assign',
            cookies,
            form: {
                reviewerId,
                unitId,
                subCriteriaId
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