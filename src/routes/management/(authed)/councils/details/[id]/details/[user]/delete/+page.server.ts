import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { submission } from "$lib/utilities";

export const load: PageServerLoad = async ({ params, cookies }) => {
    await submission({
        method: 'DELETE',
        endpoint: '/reviewcouncil/delete-reviewer/' + params.user,
        cookies,
        unauthorizedPath: '/management/councils'
    })

    redirect(308, '/management/councils?action=delete');
}