<script lang="ts">
	import Form from '$lib/crud/Form.svelte';
	import TextInput from '$lib/crud/TextInput.svelte';
	import type { PageProps } from './$types';
	import type { User } from '$lib/types/User';

	const { data }: PageProps = $props();
	const user: User = data.data;
</script>

<Form id={user?.id || 0}>
	<h2>{!user?.id ? 'Thêm người mới' : 'Thay đổi thông tin'}</h2>
	<fieldset>
		<legend>Thông tin cá nhân</legend>
		<TextInput name="username" label="Username" value={user.username || ''} required={true} />
		<TextInput name="fullname" label="Họ tên" value={user.fullName || ''} />
		<TextInput type="email" name="email" label="Email" value={user.email || ''} required={true} />
		<TextInput name="phone-number" label="Số điện thoại" value={user.phone || ''} required={true} />
	</fieldset>
	<fieldset>
		<legend>Mật khẩu</legend>
		<TextInput type="password" name="password" label="Mật khẩu mới" />
	</fieldset>
</Form>
