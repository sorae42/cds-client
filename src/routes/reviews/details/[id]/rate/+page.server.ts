import { submission } from '$lib/utilities';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
    const result = await submission({
        method: 'GET',
        endpoint: '/subcriteriaassignments/my-evaluation-periods',
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!result.ok) throw error(result.data.status, result.data.message);

    // Find the specific period
    const period = result.data.find((p: any) => p.id.toString() === params.id);
    if (!period) {
        throw error(404, 'Evaluation period not found');
    }

    // Get sub-criteria ID from URL search params
    const subCriteriaId = url.searchParams.get('subCriteriaId');
    if (!subCriteriaId) {
        throw redirect(302, `/reviews/details/${params.id}`);
    }

    // Find the specific sub-criteria
    const subCriteria = period.subCriterias?.find((sc: any) => sc.id.toString() === subCriteriaId);
    if (!subCriteria || !subCriteria.assignment) {
        throw error(404, 'Sub-criteria not found or not assigned to you');
    }

    return {
        period: period,
        subCriteria: subCriteria
    };
};

export const actions = {
    submitEvaluation: async ({ request, cookies, params }) => {
        const data = await request.formData();
        
        const score = Number(data.get('score'));
        const comment = data.get('comment')?.toString() || '';
        const subCriteriaId = Number(data.get('subCriteriaId'));
        const periodId = Number(params.id);
        const assignmentId = data.get('assignmentId')?.toString();

        // Validate required fields
        if (isNaN(subCriteriaId) || isNaN(periodId) || isNaN(score)) {
            return fail(400, { 
                error: 'Missing required fields: subCriteriaId, periodId and score are required' 
            });
        }

        let result;

        // Check if this is an edit (has assignmentId and score is not null) or create (new evaluation)
        if (assignmentId) {
            // Editing existing evaluation
            result = await submission({
                method: 'PUT',
                endpoint: `/subcriteriaassignments/submit/${assignmentId}`,
                cookies,
                form: {
                    subCriteriaId,
                    periodId,
                    score,
                    comment
                },
                formType: 'obj'
            });
        } else {
            // Creating new evaluation
            result = await submission({
                method: 'POST',
                endpoint: `/subcriteriaassignments/submit`,
                cookies,
                form: {
                    subCriteriaId,
                    periodId,
                    score,
                    comment
                },
                formType: 'obj'
            });
        }

        if (!result.ok) {
            return fail(result.data.status, { 
                error: result.data.message || 'Failed to submit evaluation' 
            });
        }

        return { 
            success: true, 
            message: 'Đánh giá đã được lưu thành công!'
        };
    }
} satisfies Actions;