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

                    // Fetch review councils to determine if user is a chairman
                    const reviewCouncilsResult = await submission({
                        method: 'GET',
                        endpoint: '/reviewcouncil/',
                        cookies,
                        unauthorizedPath: '/'
                    });

                    if (reviewCouncilsResult.ok && user) {
                        const reviewCouncils = reviewCouncilsResult.data;

                        // Check if the user is a chairman of any review council
                        const isChair = reviewCouncils.some((council: any) =>
                            council.chair && council.chair.id === user?.id
                        );

                        if (isChair) {
                            user.isChairman = true;
                        }
                        else {
                            user.isChairman = false;
                        }
                    }
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
