import { submission } from '$lib/utilities';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, params, cookies }) => {
    const result = await submission({ method: 'GET', endpoint: '/users/' + params.userid, cookies, unauthorizedPath: url.pathname })

    return {
        data: result?.data
    };
};


export const actions = {
    create: async ({ url, request, cookies }) => {
        const data = await request.formData();
        var form = new URLSearchParams();

        form.append('username', data.get('username')?.toString() || '');
        form.append('fullname', data.get('fullname')?.toString() || '');
        form.append('email', data.get('email')?.toString() || '');
        form.append('phone-number', data.get('phone-number')?.toString() || '');

        const password = data.get('username')?.toString();

        if (password)
            form.append('password', data.get('password')?.toString() || '');

        const result = await submission({
            method: 'POST',
            endpoint: '/users/create',
            cookies,
            form,
            unauthorizedPath: url.pathname
        });

        if (!result.ok) { }
    },
    update: async ({ url, request, cookies, params }) => {

    }
} satisfies Actions;
