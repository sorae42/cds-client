import { submission } from '$lib/utilities';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
    const id = url.searchParams.get("group") || 1;

    const targetGroup = await submission({ method: 'GET', endpoint: '/targetgroups', cookies, unauthorizedPath: url.pathname });
    let detailedTargetGroup = await submission({ method: 'GET', endpoint: '/targetgroups/' + id, cookies, unauthorizedPath: url.pathname });

    detailedTargetGroup.data.parentCriterias.forEach((element: any, index: number, array: Array<any>) => {
        let totalScore = 0;
        for (let e of element.subCriterias) {
            totalScore += e.maxScore;
        }
        array[index].totalScore = totalScore;
    });

    return {
        targetGroup: targetGroup.data,
        groupDetails: detailedTargetGroup.data,
        criterias: detailedTargetGroup.data.parentCriterias
    };
};

export const actions = {
    targetGroupChange: async ({ request }) => {
        const data = await request.formData();
        let id = data.get('target-group')?.toString() || '';
        return redirect(303, '?group=' + id);
    },

    newTargetGroup: async ({ url, cookies, request }) => {
        const data = await request.formData();
        var form = new URLSearchParams();
        let targetGroup = data.get('target-group')?.toString() || '';
        form.append('name', targetGroup);

        const result = await submission({ method: 'POST', endpoint: '/targetgroups/create', cookies, form, formType: 'obj', unauthorizedPath: url.pathname })
        console.log(result);

        if (!result.ok) return fail(result.data.status, { targetGroup });

        return { success: true }
    }
} satisfies Actions;
