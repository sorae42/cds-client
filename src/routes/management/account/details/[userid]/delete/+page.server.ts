import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { submission } from "$lib/utilities";

export const load: PageServerLoad = async ({ params, cookies }) => {
    await submission({
        method: 'DELETE',
        endpoint: '/users/' + params.userid,
        cookies,
        unauthorizedPath: '/management/account'
    })

    redirect(303, '/management/account?action=delete');
}
