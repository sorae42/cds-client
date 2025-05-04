import { submission } from '$lib/utilities';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
    const search = url.searchParams.get('search') || '';
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    
    const result = await submission({
        method: 'GET',
        endpoint: `/users?page=${page}&pageSize=${pageSize}${search ? `&search=${search}` : ''}`,
        cookies,
        unauthorizedPath: url.pathname
    });

    return {
        data: result.data.items,
        pagination: {
            page: result.data.page,
            pageSize: result.data.pageSize,
            totalCount: result.data.totalCount
        }
    };
};