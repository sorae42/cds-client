import type { Actions } from './$types';

export const actions = {
	login: async ({ cookies, request, fetch }) => {
		const data = await request.formData();
		var form = new URLSearchParams();
		form.append('username', data.get('username')?.toString() || '');
		form.append('password', data.get('password')?.toString() || '');

		const result = await fetch('http://localhost:5157/api/auths/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			body: form.toString()
		});

        console.log(result);

		if (result.ok) {
            console.log(result);
		}
	}
} satisfies Actions;
