import { submission } from '$lib/utilities';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies, parent }) => {
    const { user } = await parent();
    
    if (!user) {
        throw redirect(302, '/auth/login');
    }

    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    // First get all councils
    const councilsResult = await submission({ 
        method: 'GET', 
        endpoint: `/reviewcouncil`, 
        cookies, 
        unauthorizedPath: url.pathname 
    });

    if (!councilsResult.ok) {
        return {
            data: [],
            pagination: {
                page: 1,
                pageSize: 10,
                totalCount: 0
            }
        };
    }

    // Filter councils where the user is a member (either chair or member)
    const chairCouncils = [];
    const memberCouncils = [];
    
    for (const council of councilsResult.data) {
        // Always fetch detailed council info to check membership
        const detailedCouncilResult = await submission({
            method: 'GET',
            endpoint: `/reviewcouncil/${council.id}`,
            cookies
        });
        
        if (detailedCouncilResult.ok) {
            // Check if user is the chair by id (now available in detailed response)
            const isChair = detailedCouncilResult.data.chair && 
                           detailedCouncilResult.data.chair.id === user.id;
            
            // Check if user is a member in the members array (using userId field)
            const isMember = detailedCouncilResult.data.members.some((member: any) => 
                member.userId === user.id
            );
            
            if (isChair) {
                chairCouncils.push(council);
            } else if (isMember) {
                memberCouncils.push(council);
            }
        }
    }

    console.log('User is chair of', chairCouncils.length, 'councils');
    console.log('User is member of', memberCouncils.length, 'councils');

    return {
        chairCouncils,
        memberCouncils,
        pagination: {
            page: 1,
            pageSize: chairCouncils.length + memberCouncils.length,
            totalCount: chairCouncils.length + memberCouncils.length
        }
    };
};