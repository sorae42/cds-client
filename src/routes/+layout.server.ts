import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const token = cookies.get("vn.CDS.AuthToken");

    // TODO: fetch logged in fast user data
    // at the moment, i only check if the token exist, then put on the logout button instead

    return { token };
};
