import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

export const actions = {
    submitAssignment: async ({ request, cookies, params }) => {
        const data = await request.formData();
        
        const subCriteriaId = Number(data.get('subCriteriaId'));
        const periodId = Number(params.id); // Get period ID from URL params
        const score = Number(data.get('score'));
        const comment = data.get('comment')?.toString() || '';
        const evidenceInfo = data.get('evidenceInfo')?.toString() || '';
        const assignmentId = data.get('assignmentId')?.toString(); // For editing existing assignments

        // Validate required fields
        if (!subCriteriaId || !periodId || isNaN(score)) {
            return fail(400, { 
                error: 'Missing required fields: subCriteriaId, periodId, and score are required' 
            });
        }

        // Determine if this is create or update based on assignmentId
        const isUpdate = assignmentId && assignmentId !== '';
        const endpoint = isUpdate 
            ? `/subcriteriaassignments/submit/${assignmentId}`
            : '/subcriteriaassignments/submit/';
        const method = isUpdate ? 'PUT' : 'POST';

        const result = await submission({
            method,
            endpoint,
            cookies,
            form: {
                subCriteriaId,
                periodId,
                score,
                comment,
                evidenceInfo
            },
            formType: 'obj'
        });

        if (!result.ok) {
            return fail(result.data.status, { 
                error: result.data.message || 'Failed to submit assignment' 
            });
        }

        return { 
            success: true, 
            message: isUpdate ? 'Assignment updated successfully' : 'Assignment submitted successfully',
            data: result.data 
        };
    }
} satisfies Actions;