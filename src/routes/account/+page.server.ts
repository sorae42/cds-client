import { submission } from '$lib/utilities';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies, url }) => {
    const userIdResult = await submission({
        method: 'GET',
        endpoint: '/users/userid',
        cookies,
        unauthorizedPath: url.pathname
    });

    if (!userIdResult.ok) return { user: null };

    const userResult = await submission({
        method: 'GET',
        endpoint: '/users/' + userIdResult.data.userId,
        cookies,
        unauthorizedPath: url.pathname
    });

    return {
        user: userResult.data
    };
}) satisfies PageServerLoad;

export const actions = {
    updateProfile: async ({ request, cookies, url }) => {
        const data = await request.formData();
        const form = new URLSearchParams();

        const fullName = data.get('fullName')?.toString();
        const email = data.get('email')?.toString();
        const phone = data.get('phone')?.toString();
        const oldPassword = data.get('oldPassword')?.toString();
        const newPassword = data.get('newPassword')?.toString();

        if (fullName) form.append('fullName', fullName);
        if (email) form.append('email', email);
        if (phone) form.append('phone', phone);
        if (oldPassword && newPassword) {
            form.append('oldPassword', oldPassword);
            form.append('password', newPassword);
        }

        const result = await submission({
            method: 'PUT',
            endpoint: '/users/update-profile',
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) {
            return fail(result.data.status, { error: result.data.message });
        }

        return { success: true };
    }
} satisfies Actions;