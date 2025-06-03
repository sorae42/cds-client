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

    console.log('userResult', userResult.data);
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

        if (fullName) form.append('fullName', fullName);
        if (email) form.append('email', email);
        if (phone) form.append('phone', phone);

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
    },

    changePassword: async ({ request, cookies, url }) => {
        const data = await request.formData();
        const form = new URLSearchParams();

        const oldPassword = data.get('oldPassword')?.toString();
        const newPassword = data.get('newPassword')?.toString();

        if (!oldPassword || !newPassword) {
            return fail(400, { error: 'Vui lòng nhập đầy đủ thông tin' });
        }

        form.append('oldPassword', oldPassword);
        form.append('password', newPassword);

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
    },

    toggle2FA: async ({ request, cookies, url }) => {
        const data = await request.formData();
        const enabled = data.get('enabled') === 'true';

        const result = await submission({
            method: 'POST',
            endpoint: '/auths/toggle-2fa',
            cookies,
            form: enabled.toString(),
            formType: 'raw',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) {
            return fail(result.data.status, { error: result.data.message });
        }

        return { success: true };
    }
} satisfies Actions;