<script lang="ts">
	import CRUDTable from '$lib/CRUDTable.svelte';
	import { ArrowLeft, Pencil } from 'lucide-svelte';
	import UserAddPrompt from './UserAddPrompt.svelte';
	import { page } from '$app/state';

	interface UnitDetails {
		name: string;
		code: string;
		type: string;
		address?: string;
		description?: string;
		users?: { id: number; fullName: string; username: string }[];
	}

	const { data } = $props();
	const display: UnitDetails = structuredClone(data.units);

	const tableConfig = {
		data: display.users || [],
		presentation: ['Họ và tên', 'Tên đăng nhập'],
		dataBody: ['fullName', 'username'],
		detailButton: false,
		updateButton: false,
		deleteButton: false
	};
</script>

<div class="p-6">
	<div class="flex gap-4 items-center mb-4">
		<a href=".." class="btn preset-outlined-surface-500"><ArrowLeft /></a>
		<h1 class="!p-0">{display.name}</h1>
	</div>

	<div class="grid grid-cols-2 gap-4 mb-6">
		<div>
			<p class="text-gray-600 font-medium">Mã đơn vị</p>
			<p>{display.code}</p>
		</div>
		<div>
			<p class="text-gray-600 font-medium">Loại đơn vị</p>
			<p>{display.type}</p>
		</div>
		<div>
			<p class="text-gray-600 font-medium">Địa chỉ</p>
			<p>{display.address || 'Chưa cập nhật'}</p>
		</div>
		<div>
			<p class="text-gray-600 font-medium">Mô tả</p>
			<p>{display.description || 'Chưa cập nhật'}</p>
		</div>
	</div>
	<a class="btn preset-filled-primary-500 mb-4" href="{page.url.pathname}/edit"><Pencil />Chỉnh sửa</a>
	<hr />
	<div class="mt-8">
		<div class="flex items-center justify-between mb-4">
			<h2>Người dùng trong đơn vị</h2>
			<UserAddPrompt users={data.users} />
		</div>
		{#if display.users && display.users.length > 0}
			<CRUDTable {...tableConfig} />
		{:else}
			<p class="text-gray-500">Không có người dùng nào trong đơn vị này</p>
		{/if}
	</div>
</div>
