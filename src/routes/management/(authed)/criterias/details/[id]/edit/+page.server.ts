import { submission } from '$lib/utilities';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
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

        const name = data.get('name')?.toString() || '';
        const maxScore = data.get('maxScore')?.toString() || '0';
        const description = data.get('description')?.toString() || '';
        const evidenceInfo = data.get('evidenceInfo')?.toString() || '';
        const evidenceFile = data.get('evidenceFile') as File | null; // ✅ Đúng tên

        // Nếu có file được chọn
        if (evidenceFile && evidenceFile.size > 0) {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('maxScore', maxScore);
            formData.append('description', description);
            formData.append('evidenceInfo', evidenceInfo);
            formData.append('evidenceFile', evidenceFile); // ✅ Fix here

            const result = await submission({
                method: 'PUT',
                endpoint: '/subcriterias/' + params.id,
                cookies,
                form: formData,
                formType: 'formdata',
                unauthorizedPath: url.pathname
            });

            if (!result.ok) return fail(result.data.status, { name });
            return redirect(303, '/management/criterias');
        }

        // Không có file mới ➝ dùng URLSearchParams
        const form = new URLSearchParams();
        form.append('name', name);
        form.append('maxScore', maxScore);
        form.append('description', description);
        form.append('evidenceInfo', evidenceInfo);

        const result = await submission({
            method: 'PUT',
            endpoint: '/subcriterias/' + params.id,
            cookies,
            form,
            formType: 'url',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return fail(result.data.status, { name });
        return redirect(303, '/management/criterias');
    }
} satisfies Actions;
