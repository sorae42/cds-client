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
        const evidenceFile = data.get('evidenceFiles') as File | null;

        // Validate required fields
        if (isNaN(subCriteriaId) || isNaN(periodId) || isNaN(score)) {
            return fail(400, { 
                error: 'Missing required fields: subCriteriaId, periodId and score are required' 
            });
        }

        // Validate file if provided
        if (evidenceFile && evidenceFile.size > 0) {
            // Check file size (10MB limit)
            if (evidenceFile.size > 10 * 1024 * 1024) {
                return fail(400, { 
                    error: 'File size exceeds 10MB limit' 
                });
            }

            // Check file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/jpg', 
                'image/png',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];

            if (!allowedTypes.includes(evidenceFile.type)) {
                return fail(400, { 
                    error: 'File type not supported. Please upload PDF, DOC, DOCX, JPG, PNG, XLS, or XLSX files.' 
                });
            }
        }

        let result;

        // Prepare form data for submission
        const formData = new FormData();
        formData.append('subCriteriaId', subCriteriaId.toString());
        formData.append('periodId', periodId.toString());
        formData.append('score', score.toString());
        formData.append('comment', comment);
        
        // Add file if provided
        if (evidenceFile && evidenceFile.size > 0) {
            formData.append('evidenceFile', evidenceFile);
        }

        // Check if this is an edit (has assignmentId and score is not null) or create (new evaluation)
        if (assignmentId) {
            // Editing existing evaluation
            result = await submission({
                method: 'PUT',
                endpoint: `/subcriteriaassignments/submit/${assignmentId}`,
                cookies,
                form: formData,
                formType: 'formdata'
            });
        } else {
            // Creating new evaluation
            result = await submission({
                method: 'POST',
                endpoint: `/subcriteriaassignments/submit`,
                cookies,
                form: formData,
                formType: 'formdata'
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