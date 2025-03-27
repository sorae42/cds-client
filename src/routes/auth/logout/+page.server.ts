import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    cookies.delete("vn.CDS.AuthToken", { path: "/" });
    redirect(308, "/");
}
