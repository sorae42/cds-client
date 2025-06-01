import { submission } from '$lib/utilities';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url, parent }) => {
    const { user } = await parent();
    
    const [summaryResult, progressResult] = await Promise.all([
        submission({
            method: 'GET',
            endpoint: '/dashboard/summary',
            cookies,
            unauthorizedPath: url.pathname
        }),
        submission({
            method: 'GET',
            endpoint: '/dashboard/current-progress',
            cookies,
            unauthorizedPath: url.pathname
        })
    ]);

    const summary = summaryResult.ok ? summaryResult.data : {
        totalUnits: 0,
        totalEvaluationPeriods: 0,
        totalUsers: 0,
        totalReviewCouncils: 0,
        totalCriteria: 0
    };

    const currentProgress = progressResult.ok ? progressResult.data : [];

    return {
        summary,
        currentProgress,
        user
    };
};