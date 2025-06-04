<script lang="ts">
	import Form from '$lib/crud/Form.svelte';
	import TextInput from '$lib/crud/TextInput.svelte';
	import type { PageProps } from './$types';
	import type { User } from '$lib/types/User';

	const { data }: PageProps = $props();
	const user: User = data.data;

	const roleOptions = [
		{ value: 'user', label: 'Người dùng đơn vị' },
		{ value: 'chair', label: 'Chủ tịch hội đồng' },
		{ value: 'admin', label: 'Quản trị viên' }
	];
</script>

<Form id={user?.id || 0}>
	<h2>{!user?.id ? 'Thêm người mới' : 'Thay đổi thông tin'}</h2>
	<fieldset>
		<legend>Thông tin cá nhân</legend>
		<TextInput name="username" label="Username" value={user?.username || ''} required={true} />
		<TextInput name="fullname" label="Họ tên" value={user?.fullName || ''} />
		<TextInput type="email" name="email" label="Email" value={user?.email || ''} required={true} />
		<TextInput name="phone-number" label="Số điện thoại" value={user?.phone || ''} required={true} />

		<div class="form-group my-4">
			<label for="role" class="label">
				<span>Vai trò *</span>
			</label>
			<select
				id="role"
				name="role"
				class="select"
				value={user?.role || 'user'}
				required
			>
				{#each roleOptions as option}
					<option value={option.value} selected={user?.role === option.value}>
						{option.label}
					</option>
				{/each}
			</select>
		</div>
	</fieldset>
	<fieldset>
		<legend>Mật khẩu</legend>
		<TextInput type="password" name="password" label="Mật khẩu mới" />
	</fieldset>
</Form>
