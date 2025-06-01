import { submission } from '$lib/utilities';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    const [councilResult, usersResult] = await Promise.all([
        submission({
            method: 'GET',
            endpoint: '/reviewcouncil/' + params.id,
            cookies
        }),
        submission({
            method: 'GET',
            endpoint: '/users',
            cookies
        })
    ]);

    if (!councilResult.ok) throw error(councilResult.data.status, councilResult.data.message);

    // Filter out users who are already members
    const availableUsers = usersResult.data.items.filter(
        (user: any) => !councilResult.data.members.find((m: any) => m.id === user.id)
    );

    return { 
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