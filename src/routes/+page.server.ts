import { streamJson } from '$lib/utilities';
import type { Actions } from './$types';

export const actions = {
    login: async ({ request, fetch }) => {
        const data = await request.formData();
        var form = new URLSearchParams();
        form.append('username', data.get('username')?.toString() || '');
        form.append('password', data.get('password')?.toString() || '');

        const result = await fetch('http://localhost:5157/api/auths/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: form.toString()
        });

        var a = await streamJson(result.body);

        if (!result.ok) {
            return { success: false, message: a.data.message };
        }

        return { success: true };
    },

    // TODO
    reset: async ({ request, fetch }) => {
        const data = await request.formData();
        var form = new URLSearchParams();
        form.append('email', data.get('email')?.toString() || '');

        const result = await fetch('http://localhost:5157/api/auths/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: form.toString()
        });

        var a = await streamJson(result.body);
        console.log(a)

        if (!result.ok) {
            return { success: false, message: a.data.message };
        }

        return { success: true };

    }
} satisfies Actions;
