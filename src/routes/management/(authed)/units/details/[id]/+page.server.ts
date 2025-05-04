import { submission } from '$lib/utilities';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url, cookies, params }) => {
    const result = await submission({ method: 'GET', endpoint: '/units/' + params.id, cookies, unauthorizedPath: url.pathname })
    const users = await submission({ method: 'GET', endpoint: '/users/', cookies, unauthorizedPath: url.pathname })
    return {
        units: result.data,
        users: users.data.items,
    };
};

export const actions: Actions = {
    addUser: async ({ request, cookies, params, url }) => {
        const data = await request.formData();
        const userId = data.get('userId');

        const result = await submission({
            method: 'PUT',
            endpoint: `/units/${params.id}`,
            cookies,
            form: { userid: userId },
            formType: 'obj',
            unauthorizedPath: url.pathname
        });

        if (!result.ok) {
            return {
                success: false,
                message: result.data
            };
        }

        return {
            success: true
        };
    }
} satisfies Actions;
