import { page } from "$app/state";
import { redirect, type Cookies } from "@sveltejs/kit";

export async function streamJson(stream: ReadableStream<Uint8Array> | null) {
    if (stream == null) return { done: false, data: null };
    const decoder = new TextDecoder('utf-8');
    const b = await stream.getReader().read();
    const json = JSON.parse(decoder.decode(b.value));
    return { done: b.done, data: json };
}

export interface Submission {
    method: string,
    endpoint: string,
    cookies: Cookies,
    form?: URLSearchParams | FormData,
    unauthorizedPath?: string
}

export async function submission(dataSubmission: Submission) {
    const formData: RequestInit = {
        method: dataSubmission.method,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    };

    const token = dataSubmission.cookies.get("vn.CDS.AuthToken")
    if (token) formData.headers = {
        'Authorize': 'Bearer' + token
    }

    if (dataSubmission.form) formData.body = dataSubmission.form.toString();

    const data = await fetch("http://localhost:5157/api" + dataSubmission.endpoint, formData);

    if (data.status === 401) {
        console.log(dataSubmission.unauthorizedPath)
        redirect(307, "/auth?redirectTo=" + dataSubmission.unauthorizedPath);
    }

    var a = await streamJson(data.body);

    return {
        ok: data.ok,
        ...a
    };
}
