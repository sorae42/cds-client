import { submission } from '$lib/utilities';
import { fail, json } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const [assignments, targetGroups, units] = await Promise.all([
        submission({
            method: 'GET',
            endpoint: `/reviewcouncil/assignments/${params.id}`,
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

    const reviewer = assignments.data.find((r: any) => r.reviewerId.toString() === params.user);

    return {
        reviewer,
        assignments: reviewer?.assignments || [],
        targetGroups: processedGroups,
        units: units.data
    };
};

export const actions = {
    assign: async ({ request, cookies }) => {
        const data = await request.formData();
        console.log(data);

        const reviewerId = Number(data.get('reviewerId'));
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