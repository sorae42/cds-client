import { submission } from '$lib/utilities';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    // If ID is 0, return empty data for create mode
    if (params.id === '0') {
        const users = await submission({
            method: 'GET',
            endpoint: '/users',
            cookies
        });
        // Filter users to only show chairs
        const chairUsers = users.data.items.filter((user: any) => user.role === 'chair');
        return { council: null, users: chairUsers };
    }

    // Otherwise load existing council and users for edit mode
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

    console.log(usersResult.data.items);

    // Filter users to only show chairs
    const chairUsers = usersResult.data.items.filter((user: any) => user.role === 'chair');

    return { 
        council: councilResult.data,
        users: chairUsers
    };
};

export const actions = {
    default: async ({ request, cookies, params, url }) => {
        const data = await request.formData();
        const isCreate = params.id === '0';

        const form = {
            name: data.get('name')?.toString() || '',
            chairAuthId: Number(data.get('chairAuthId')) || 0
        };

        const result = await submission({
            method: isCreate ? 'POST' : 'PUT',
            endpoint: isCreate ? '/reviewcouncil/create' : `/reviewcouncil/${params.id}`,
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return fail(result.data.status, { error: result.data.message });
        return redirect(303, '/management/councils');
    }
} satisfies Actions;