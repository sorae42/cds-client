import { submission } from '$lib/utilities';
import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
    if (params.id === '0') return { period: null };

    const result = await submission({
        method: 'GET',
        endpoint: '/evaluationperiods/' + params.id,
        cookies
    });

    if (!result.ok) throw error(result.data.status, result.data.message);
    return { period: result.data };
};

export const actions = {
    default: async ({ url, cookies, request, params }) => {
        const data = await request.formData();
        var form = new URLSearchParams();

        let name = data.get('name')?.toString() || '';
        let startDate = data.get('startDate')?.toString() || '';
        let endDate = data.get('endDate')?.toString() || '';

        // Convert dates to UTC ISO string
        const startUTC = new Date(startDate).toISOString();
        const endUTC = new Date(endDate).toISOString();

        form.append('name', name);
        form.append('startDate', startUTC);
        form.append('endDate', endUTC);

        const isCreate = params.id === '0';
        const result = await submission({
            method: isCreate ? 'POST' : 'PUT',
            endpoint: isCreate ? '/evaluationperiods/create' : `/evaluationperiods/${params.id}`,
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return fail(result.data.status, { name });
        return redirect(303, '/management/ratings');
    }
} satisfies Actions;