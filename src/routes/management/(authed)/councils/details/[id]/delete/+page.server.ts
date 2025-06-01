import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { submission } from "$lib/utilities";

export const load: PageServerLoad = async ({ params, cookies }) => {
    await submission({
        method: 'DELETE',
        endpoint: '/reviewcouncil/' + params.id,
        cookies,
        unauthorizedPath: '/management/councils'
    })

    redirect(303, '/management/councils?action=delete');
}