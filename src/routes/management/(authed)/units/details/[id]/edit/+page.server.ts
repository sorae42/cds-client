import { submission } from '$lib/utilities';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface Unit {
    id?: number;
    name: string;
    code: string;
    type: string;
    address?: string;
    description?: string;
}

export const load: PageServerLoad = async ({ url, params, cookies }) => {
    const result = await submission({
        method: 'GET',
        endpoint: '/units/' + params.id,
        cookies,
        unauthorizedPath: url.pathname
    });

    console.log(result.data)

    return {
        units: result?.data
    };
};

export const actions = {
    create: async ({ url, request, cookies }) => {
        const data = await request.formData();
        let form: Unit = {
            name: data.get('name')?.toString() || '',
            code: data.get('code')?.toString() || '',
            type: data.get('type')?.toString() || '',
            address: data.get('address')?.toString() || undefined,
            description: data.get('description')?.toString() || undefined
        };

        const result = await submission({
            method: 'POST',
            endpoint: '/units/create',
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return { success: false, message: result.data };
        redirect(303, '/management/unit');
    },

    update: async ({ url, request, cookies }) => {
        const data = await request.formData();
        let form: Unit = {
            id: Number(data.get('id')?.toString()) || 0,
            name: data.get('name')?.toString() || '',
            code: data.get('code')?.toString() || '',
            type: data.get('type')?.toString() || '',
            address: data.get('address')?.toString() || undefined,
            description: data.get('description')?.toString() || undefined
        };

        const result = await submission({
            method: 'PUT',
            endpoint: '/units/' + form.id,
            cookies,
            form,
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) return { success: false, message: result.data };
        redirect(303, '/management/units');
    }
} satisfies Actions;