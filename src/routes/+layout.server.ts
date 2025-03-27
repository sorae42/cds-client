import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const token = cookies.get("vn.CDS.AuthToken");

    // TODO: fetch logged in fast user data

    return { token };
};
