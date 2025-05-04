import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
    const { user } = await parent();
    
    if (!user || user.role !== 'admin') {
        throw error(404, {
            message: 'Không tìm thấy trang này.'
        });
    }
    
    return {};
};