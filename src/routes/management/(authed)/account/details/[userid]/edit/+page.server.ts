import { submission } from '$lib/utilities';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { User } from '$lib/types/User';

export const load: PageServerLoad = async ({ url, params, cookies }) => {
    const result = await submission({ method: 'GET', endpoint: '/users/' + params.userid, cookies, unauthorizedPath: url.pathname })

    return {
        data: result?.data
    };
};

export const actions = {
    create: async ({ url, request, cookies }) => {
        const data = await request.formData();
        let form: User = { username: "", phone: "", role: "user" };

        form.username = data.get('username')?.toString() || '';
        form.fullName = data.get('fullname')?.toString() || '';
        form.email = data.get('email')?.toString() || '';
        form.phone = data.get('phone-number')?.toString() || '';

        const password = data.get('username')?.toString();

        if (password)
            form.password = data.get('password')?.toString() || '';

        const result = await submission({
            method: 'POST',
            endpoint: '/users/create',
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return { success: false, message: result.data }

        redirect(303, '/management/account');
    },
    update: async ({ url, request, cookies }) => {
        const data = await request.formData();
        let form: User = { username: "", phone: "", role: "user" };

        form.id = Number(data.get('id')?.toString()) || 0;
        form.username = data.get('username')?.toString() || '';
        form.fullName = data.get('fullname')?.toString() || '';
        form.email = data.get('email')?.toString() || '';
        form.phone = data.get('phone-number')?.toString() || '';

        const password = data.get('username')?.toString();

        if (password)
            form.password = data.get('password')?.toString() || '';

        const result = await submission({
            method: 'PUT',
            endpoint: '/users/' + form.id,
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return { success: false, message: result.data }

        redirect(303, '/management/account');

    }
} satisfies Actions;
