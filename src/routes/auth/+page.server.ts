import { submission } from '$lib/utilities';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    login: async ({ url, request, cookies }) => {
        const data = await request.formData();
        var form = new URLSearchParams();
        form.append('username', data.get('username')?.toString() || '');
        form.append('password', data.get('password')?.toString() || '');

        const result = await submission({ method: 'POST', endpoint: '/auths/login', cookies, form })
        cookies.set('vn.CDS.AuthToken', result.data.token, { path: '/' });

        console.log(result.data)
        if (!result.ok) {
            return { success: false, message: result.data.message };
        }

        const redirectTo = url.searchParams.get("redirectTo") || "";
        redirect(307, redirectTo);
    },

    // TODO
    reset: async ({ request, cookies }) => {
        const data = await request.formData();
        var form = new URLSearchParams();
        form.append('email', data.get('email')?.toString() || '');
        const result = await submission({ method: 'POST', endpoint: '/auths/forgot-password', cookies, form })

        if (!result.ok) {
            return { success: false, message: result.data.message };
        }

        return { success: true };

    }
} satisfies Actions;
