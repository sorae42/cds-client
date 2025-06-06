import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url, parent }) => {
    const { user } = await parent();

    if (!user) {
        throw error(401, 'Unauthorized');
    }

    // Fetch council data to verify user is chairman
    const councilResult = await submission({
        method: 'GET',
        endpoint: `/reviewcouncil/${params.id}`,
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!councilResult.ok) {
        throw error(councilResult.data.status, councilResult.data.message);
    }

    // Check if current user is the chairman
    const isChairman = councilResult.data.chair && councilResult.data.chair.id === user.id;

    if (!isChairman) {
        throw error(403, 'Access denied. You must be the chairman of this council.');
    }

    // Fetch all reviewers and their assignments
    const reviewersResult = await submission({
        method: 'GET',
        endpoint: `/reviewcouncil/view?reviewerId=${params.reviewerid}`,
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!reviewersResult.ok) {
        throw error(reviewersResult.data.status, reviewersResult.data.message);
    }

    // Fetch units for the adding subcriteria functionality
    const unitsResult = await submission({
        method: 'GET',
        endpoint: '/units',
        cookies
    });

    // The data is already the assignments for the specific reviewer
    const assignments = reviewersResult.data || [];

    // Create a reviewer object with the assignments
    const reviewer = {
        reviewerId: params.reviewerid,
        assignments: assignments,
        fullName: null,
        isChair: false
    };

    return {
        reviewer,
        council: councilResult.data,
        units: unitsResult.ok ? unitsResult.data : []
    };
};

export const actions: Actions = {
    submitReview: async ({ request, cookies, url }) => {
        const formData = await request.formData();

        const reviewAssignmentId = formData.get('reviewAssignmentId');
        const score = formData.get('score');
        const comment = formData.get('comment');

        if (!reviewAssignmentId || !score) {
            return fail(400, { error: 'Missing required fields' });
        }

        try {
            const result = await submission({
                method: 'POST',
                endpoint: '/finalreviewresults/submit',
                cookies,
                form: {
                    reviewassignmentid: parseInt(reviewAssignmentId.toString()),
                    finalscore: parseInt(score.toString()),
                    finalcomment: comment?.toString() || ''
                },
                formType: 'obj'
            });

            if (!result.ok) {
                return fail(result.data.status || 500, {
                    error: result.data.message || 'Failed to submit review'
                });
            }

            return { success: true };
        } catch (err) {
            console.error('Submit review error:', err);
            return fail(500, { error: 'An error occurred while submitting the review' });
        }
    },

    assign: async ({ request, cookies, params }) => {
        const data = await request.formData();

        const reviewerId = Number(params.reviewerid);
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
};