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