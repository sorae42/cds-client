import { redirect, type Cookies } from "@sveltejs/kit";

export async function streamJson(stream: ReadableStream<Uint8Array> | null) {
    if (stream == null) return { done: false, data: null };
    const decoder = new TextDecoder('utf-8');
    const b = await stream.getReader().read();
    const c = decoder.decode(b.value);
    let json: any;
    try {
        json = JSON.parse(c);
    } catch (e) {
        json = JSON.parse("{}");
        console.error("Error attempting to decode data: ", e);
        console.error("Data dump at b: ", b);
        console.error("Data dump at c: ", c);
    }
    return { done: b.done, data: json };
}

export interface Submission {
    method: string,
    endpoint: string,
    cookies: Cookies,
    form?: URLSearchParams,
    formType?: string,
    unauthorizedPath?: string
}

export async function submission(dataSubmission: Submission) {
    const headers: Headers = new Headers();

    const formData: RequestInit = { method: dataSubmission.method }

    const token = dataSubmission.cookies.get("vn.CDS.AuthToken");

    if (token !== "") {
        formData.credentials = 'include';
        headers.append('Authorization', 'Bearer ' + token);
    }

    formData.headers = headers;

    if (dataSubmission.form) {
        switch (dataSubmission.formType) {
            case 'url':
                headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                formData.body = dataSubmission.form.toString();
                break;
            case 'obj':
                headers.append('Content-Type', 'application/json; charset=UTF-8');
                formData.body = JSON.stringify(groupParamsByKey(dataSubmission.form));
                break;
        }
    }

    const data = await fetch("http://localhost:5157/api" + dataSubmission.endpoint, formData);
    console.log(`${data.status} ${dataSubmission.method} ${dataSubmission.endpoint}`);

    if (!data.url.includes("/api/auths") && data.status === 401) {
        dataSubmission.cookies.set("vn.CDS.RedirectTo", dataSubmission.unauthorizedPath || "/", { path: '/' })
        dataSubmission.cookies.delete('vn.CDS.AuthToken', { path: '/' });
        redirect(307, "/auth?redirectTo=" + dataSubmission.unauthorizedPath);
    }

    const a = await streamJson(data.body);

    return {
        ok: data.ok,
        ...a
    };
}

const groupParamsByKey = (params: URLSearchParams) => [...params.entries()].reduce((acc: any, tuple: any) => {
    const [key, val] = tuple;
    if (acc.hasOwnProperty(key)) {
        if (Array.isArray(acc[key])) {
            acc[key] = [...acc[key], val]
        } else {
            acc[key] = [acc[key], val];
        }
    } else {
        acc[key] = val;
    }

    return acc;
}, {});
