import { submission } from '$lib/utilities';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
    // Load subcriteria details
    const result = await submission({ 
        method: 'GET', 
        endpoint: '/subcriterias/' + params.id,
        cookies,
        unauthorizedPath: url.pathname
    });

    return {
        subCriteria: result.data
    };
};

export const actions = {
    default: async ({ request, cookies, url, params }) => {
        const data = await request.formData();
        var form = new URLSearchParams();

        // Get form data
        let name = data.get('name')?.toString() || '';
        let maxScore = data.get('maxScore')?.toString() || '0';
        let description = data.get('description')?.toString() || '';
        let evidenceInfo = data.get('evidenceInfo')?.toString() || '';

        // Append to form
        form.append('name', name);
        form.append('maxScore', maxScore);
        form.append('description', description);
        form.append('evidenceInfo', evidenceInfo);

        const result = await submission({
            method: 'PUT',
            endpoint: '/subcriterias/' + params.id,
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return fail(result.data.status, { name });

        return redirect(303, '/management/criterias');
    }
} satisfies Actions;