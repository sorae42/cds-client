import { submission } from '$lib/utilities';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    const periods = await submission({ 
        method: 'GET', 
        endpoint: `/evaluationperiods?page=${page}&pageSize=${pageSize}`, 
        cookies, 
        unauthorizedPath: url.pathname 
    });

    return {
        data: periods.data.items,
        pagination: {
            page: periods.data.page,
            pageSize: periods.data.pageSize,
            totalCount: periods.data.totalCount
        }
    };
};

export const actions = {
    renamePeriod: async ({ url, cookies, request }) => {
        const data = await request.formData();
        const form = new URLSearchParams();
        const periodName = data.get('period-name')?.toString() || '';
        const id = data.get('id')?.toString() || '';

        form.append('name', periodName);

        const result = await submission({
            method: 'PUT',
            endpoint: '/evaluationperiods/' + id,
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return fail(result.data.status, { periodName });
        return redirect(303, `${url.pathname}?period=${id}`);
    },

    lockPeriod: async ({ url, cookies, request }) => {
        const data = await request.formData();
        const form = new URLSearchParams();
        
        const id = data.get('period')?.toString() || '';
        const reason = data.get('reason')?.toString() || '';
        const unlockDate = data.get('unlockDate')?.toString();

        form.append('id', id);
        form.append('reason', reason);
        if (unlockDate) {
            form.append('until', new Date(unlockDate).toISOString());
        }

        const result = await submission({
            method: 'POST',
            endpoint: '/evaluationperiods/lockperiod?id=' + id,
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return fail(result.data.status, { error: result.data.message });
        return redirect(303, `${url.pathname}?period=${id}`);
    },

    unlockPeriod: async ({ url, cookies, request }) => {
        const data = await request.formData();
        const form = new URLSearchParams();
        
        const id = data.get('period')?.toString() || '';
        const reason = data.get('reason')?.toString() || '';

        form.append('reason', reason);

        const result = await submission({
            method: 'POST',
            endpoint: '/evaluationperiods/unlockperiod?id=' + id,
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return fail(result.data.status, { error: result.data.message });
        return redirect(303, `${url.pathname}?period=${id}`);
    }
} satisfies Actions;