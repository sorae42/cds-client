<script lang="ts">
	import Form from '$lib/crud/Form.svelte';
	import TextInput from '$lib/crud/TextInput.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	interface User {
		id: number;
		username: string;
		fullName?: string;
		email?: string;
		phone: string;
	}

	const user: User = data.data;
</script>

<Form action="?/update" id={user?.id || 0}>
	<h2>{user?.id !== 0 ? 'Thêm người mới' : 'Thay đổi thông tin'}</h2>
	<TextInput name="username" label="Username" value={user.username || ''} />
	<TextInput name="fullname" label="Họ tên" value={user.fullName || ''} />
	<TextInput type="email" name="email" label="Email" value={user.email || ''} />
	<TextInput name="phone-number" label="Số điện thoại" value={user.phone || ''} />
</Form>
