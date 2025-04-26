import { submission } from '$lib/utilities';
import type { Actions } from './$types';

// TODO: use fail function instead of returning success
//
export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        var form = new URLSearchParams();
        form.append('username', data.get('username')?.toString() || '');
        form.append('password', data.get('password')?.toString() || '');

        const result = await submission({ method: 'POST', endpoint: '/auths/login', cookies, form, formType: 'url' })
        if (result.data.token)
            cookies.set('vn.CDS.AuthToken', result.data.token, { path: '/' });

        if (!result.ok) {
            return { success: false, message: result.data.message };
        }

        const redirectTo = cookies.get("vn.CDS.RedirectTo") || "/criterias";
        return {
            success: true,
            message: 'REDIRECT',
            location: redirectTo
        }
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
