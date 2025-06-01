import { redirect, type Cookies } from "@sveltejs/kit";

export async function streamJson(stream: ReadableStream<Uint8Array> | null) {
    if (stream == null) return { done: false, data: null };
    const decoder = new TextDecoder('utf-8');
    const b = await stream.getReader().read();
    const c = decoder.decode(b.value);
    let json: any;
    try {
        json = JSON.parse(c);
    } catch (e: any) {
        json = JSON.parse("{}");
        console.error("Error attempting to decode data: ", e instanceof Error ? e.message : String(e));
        console.error("Data dump at b: ", b);
        console.error("Data dump at c: ", c);
    }
    return { done: b.done, data: json };
}

export interface Submission {
    method: string,
    endpoint: string,
    cookies: Cookies,
    form?: any,
    formType?: 'url' | 'obj' | 'raw', // update type definition
    unauthorizedPath?: string
}

const groupParamsByKey = (params: URLSearchParams) => [...params.entries()].reduce((acc: Record<string, any>, [key, val]) => {
    if (acc.hasOwnProperty(key)) {
        acc[key] = Array.isArray(acc[key]) ? [...acc[key], val] : [acc[key], val];
    } else {
        acc[key] = val;
    }
    return acc;
}, {});

export async function submission(dataSubmission: Submission) {
    const headers = new Headers();
    const formData: RequestInit = { 
        method: dataSubmission.method,
        credentials: 'include'
    };

    const token = dataSubmission.cookies.get("vn.CDS.AuthToken");
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }

    if (dataSubmission.form) {
        try {
            switch (dataSubmission.formType) {
                case 'raw': {
                    headers.append('Content-Type', 'application/json; charset=UTF-8');
                    formData.body = dataSubmission.form.toString();
                    break;
                }
                case 'url': {
                    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    const params = dataSubmission.form instanceof URLSearchParams 
                        ? dataSubmission.form 
                        : new URLSearchParams(dataSubmission.form);
                    formData.body = params.toString();
                    break;
                }
                case 'obj':
                default: {
                    headers.append('Content-Type', 'application/json; charset=UTF-8');
                    if (dataSubmission.form instanceof URLSearchParams) {
                        // Convert URLSearchParams to properly grouped object
                        const grouped = groupParamsByKey(dataSubmission.form);
                        // Handle arrays by parsing string representations
                        Object.keys(grouped).forEach(key => {
                            if (typeof grouped[key] === 'string' && grouped[key].startsWith('[')) {
                                try {
                                    grouped[key] = JSON.parse(grouped[key]);
                                } catch (e) {
                                    console.error('Failed to parse array:', e);
                                }
                            }
                        });
                        formData.body = JSON.stringify(grouped);
                    } else {
                        formData.body = JSON.stringify(dataSubmission.form);
                    }
                    break;
                }
            }

            console.debug(formData.body);
        } catch (error) {
            console.error('Form data processing error:', error, dataSubmission.form);
            throw new Error('Failed to process form data');
        }
    }

    formData.headers = headers;

    try {
        console.debug(`${dataSubmission.method} ${dataSubmission.endpoint}`);

        const data = await fetch("http://localhost:5157/api" + dataSubmission.endpoint, formData);
        
        if (!data.url.includes("/api/auths") && data.status === 401) {
            dataSubmission.cookies.set("vn.CDS.RedirectTo", dataSubmission.unauthorizedPath || "/", { path: '/' })
            dataSubmission.cookies.delete('vn.CDS.AuthToken', { path: '/' });
            redirect(307, "/auth?redirectTo=" + dataSubmission.unauthorizedPath);
        }

        const response = await streamJson(data.body);

        if (!data.ok && data.status !== 401) {
            console.error(`Error ${data.status}: ${dataSubmission.endpoint}`);
        }

        return {
            ok: data.ok,
            ...response
        };

    } catch (error) {
        console.error(`Request failed: ${dataSubmission.endpoint}`);
        throw error;
    }
}
