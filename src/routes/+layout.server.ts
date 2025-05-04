import { submission } from '$lib/utilities';
import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types/User';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const token = cookies.get("vn.CDS.AuthToken");
    let user: Partial<User> | null = null;

    if (token) {
        try {
            // First get user ID
            const userIdResult = await submission({
                method: 'GET',
                endpoint: '/users/userid',
                cookies,
                unauthorizedPath: '/'
            });

            if (userIdResult.ok) {
                // Then get detailed user data
                const userResult = await submission({
                    method: 'GET',
                    endpoint: '/users/' + userIdResult.data.userId,
                    cookies,
                    unauthorizedPath: '/'
                });

                if (userResult.ok) {
                    user = userResult.data;
                }
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            cookies.delete("vn.CDS.AuthToken", { path: '/' });
        }
    }

    return { 
        token,
        user 
    };
};
