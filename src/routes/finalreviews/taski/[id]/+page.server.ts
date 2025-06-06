import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url, parent }) => {
    const { user } = await parent();
    
    if (!user) {
        throw error(401, 'Unauthorized');
    }

    // Fetch council data to verify user is a member
    const councilResult = await submission({
        method: 'GET',
        endpoint: `/reviewcouncil/${params.id}`,
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!councilResult.ok) {
        throw error(councilResult.data.status, councilResult.data.message);
    }

    // Check if current user is a member (but not chairman)
    const isChairman = councilResult.data.chair && councilResult.data.chair.id === user.id;
    const isMember = councilResult.data.members.some((member: any) => member.userId === user.id);
    
    if (!isMember || isChairman) {
        throw error(403, 'Access denied.');
    }

    // Get the reviewer ID from council members based on logged-in user's userId
    const currentUserMember = councilResult.data.members.find((member: any) => member.userId === user.id);
    
    if (!currentUserMember) {
        throw error(403, 'User is not a member of this council.');
    }
    
    // Fetch all reviewers and their assignments using the correct reviewer ID
    const reviewersResult = await submission({
        method: 'GET',
        endpoint: `/reviewcouncil/view?reviewerId=${currentUserMember.id}`,
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!reviewersResult.ok) {
        throw error(reviewersResult.data.status, reviewersResult.data.message);
    }

    // The API now returns assignments directly
    const userAssignments = reviewersResult.data || [];

    // Fetch subcriteria details for each assignment (now redundant since details are included)
    const assignmentsWithDetails = userAssignments.map((assignment: any) => ({
        ...assignment,
        subCriteriaDetails: {
            id: assignment.subCriteriaId,
            name: assignment.subCriteriaName
        }
    }));

    // Fetch review results for the current user
    const reviewResultsResponse = await submission({
        method: 'GET',
        endpoint: `/reviewresults/list/?reviewerId=${currentUserMember.id}`,
        cookies,
        unauthorizedPath: url.pathname
    });

    const reviewResults = reviewResultsResponse.ok ? reviewResultsResponse.data : [];

    return {
        currentUser: user,
        userAssignments: assignmentsWithDetails,
        reviewResults,
        council: councilResult.data,
        reviewerInfo: { assignments: userAssignments }
    };
};

export const actions = {
    submitReview: async ({ request, cookies }) => {
        const data = await request.formData();
        
        const reviewAssignmentId = Number(data.get('reviewAssignmentId'));
        const score = Number(data.get('score')) || 10;
        const comment = data.get('comment')?.toString() || '';

        const result = await submission({
            method: 'POST',
            endpoint: '/reviewresults/submit',
            cookies,
            form: {
                ReviewAssignmentId: reviewAssignmentId,
                score: score,
                comment: comment
            },
            formType: 'obj'
        });

        if (!result.ok) {
            return fail(result.data.status, { error: result.data.message });
        }

        return { success: true, data: result.data.data };
    }
} satisfies Actions;