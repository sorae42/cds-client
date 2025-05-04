import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { submission } from "$lib/utilities";

export const load: PageServerLoad = async ({ params, cookies }) => {
    await submission({
        method: 'DELETE',
        endpoint: '/units/' + params.userid,
        cookies,
        unauthorizedPath: '/management/units'
    })

    redirect(303, '/management/units?action=delete');
}

// Unused feature, not implemented in the backend yet.
