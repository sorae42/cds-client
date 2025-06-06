import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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
        endpoint: `/reviewcouncil/view?reviewCouncilId=${params.id}`,
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!reviewersResult.ok) {
        throw error(reviewersResult.data.status, reviewersResult.data.message);
    }

    // Fetch all users to show available members for assignment
    const usersResult = await submission({
        method: 'GET',
        endpoint: '/users',
        cookies
    });

    // Filter out users who are already members
    const availableUsers = usersResult.ok ? usersResult.data.items.filter(
        (user: any) => !councilResult.data.members.find((m: any) => m.userId === user.id)
    ) : [];

    return {
        currentUser: user,
        allReviewers: reviewersResult.data || [],
        council: councilResult.data,
        availableUsers
    };
};

export const actions = {
    addReviewer: async ({ request, cookies, params }) => {
        const data = await request.formData();
        const authId = Number(data.get('userId'));
        
        const result = await submission({
            method: 'POST',
            endpoint: '/reviewcouncil/add-reviewer',
            cookies,
            form: {
                reviewCouncilId: Number(params.id),
                authId
            },
            formType: 'obj'
        });

        if (!result.ok) return fail(result.data.status, { error: result.data.message });
        return { success: true };
    }
} satisfies Actions;