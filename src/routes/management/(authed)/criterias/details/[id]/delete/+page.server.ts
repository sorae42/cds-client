import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { submission } from "$lib/utilities";

export const load: PageServerLoad = async ({ params, cookies }) => {
    await submission({
        method: 'DELETE',
        endpoint: '/subcriterias/' + params.id,
        cookies,
        unauthorizedPath: '/management/subcriterias'
    })

    redirect(308, '/management/subcriterias?action=delete');
}