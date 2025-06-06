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
        council: councilResult.data
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
    }
};