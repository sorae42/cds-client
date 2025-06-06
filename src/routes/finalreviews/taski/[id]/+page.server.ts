import { submission } from '$lib/utilities';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
        throw error(403, 'Access denied. You must be a member (not chairman) of this council.');
    }

    // Fetch all reviewers and their assignments
    const reviewersResult = await submission({
        method: 'GET',
        endpoint: `/reviewcouncil/view?reviewCouncilId=${params.id}`,
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!reviewersResult.ok) {
        throw error(reviewersResult.data.status, reviewersResult.data.message);
    }

    // Filter to only show current user's assignments
    const currentUserReviewer = reviewersResult.data.find((reviewer: any) => 
        reviewer.username === user.username
    );

    return {
        currentUser: user,
        userAssignments: currentUserReviewer?.assignments || [],
        council: councilResult.data,
        reviewerInfo: currentUserReviewer
    };
};