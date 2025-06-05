<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { Search } from 'lucide-svelte';
	import TextInput from '$lib/crud/TextInput.svelte';
	import { toaster } from '$lib/toaster.js';

	let { data } = $props();
	const isCreate = !data.council;

	let openUserSelect = $state(false);
	let searchQuery = $state('');
	let selectedUser = $state(data.council?.chair || null);

	$effect(() => {
		// Reset search when modal closes
		if (!openUserSelect) searchQuery = '';
	});

	// Filter users based on search
	const filteredUsers = $derived(
		searchQuery
			? data.users.filter(
					(user: { fullName: string; username: string }) =>
						user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
						user.username.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: data.users
	);
</script>

<div class="p-8">
	<div class="card p-4">
		<h3 class="h3 mb-4">{isCreate ? 'Tạo hội đồng mới' : 'Chỉnh sửa hội đồng'}</h3>

		<form
			method="POST"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === "failure") {
						toaster.error({ title: result.data?.error || 'Có lỗi xảy ra!' });
						return;
					}
					toaster.success({ title: 'Cập nhật thành công!' });
					applyAction(result);
				};
			}}
		>
			<div class="space-y-4">
				<TextInput name="name" label="Tên hội đồng:" value={data.council?.name} required />

				<div class="form-group">
					<span>Chủ tịch hội đồng:</span>
					<div class="flex items-center gap-2">
						<button type="button" class="btn preset-tonal" onclick={() => (openUserSelect = true)}>
							{selectedUser ? 'Đổi' : 'Chọn'} chủ tịch
						</button>
						{#if selectedUser}
							<span class="flex items-center gap-2">
								<span>{selectedUser.fullName} ({selectedUser.username})</span>
							</span>
						{/if}
					</div>
					<input type="hidden" name="chairAuthId" value={selectedUser?.id || ''} required />
				</div>
			</div>

			<footer class="flex justify-between mt-8">
				<a href="/management/councils" class="btn preset-tonal"> Huỷ </a>
				<button type="submit" class="btn preset-filled">
					{isCreate ? 'Thêm mới' : 'Cập nhật'}
				</button>
			</footer>
		</form>
	</div>
</div>

<Modal
	open={openUserSelect}
	onOpenChange={(e) => (openUserSelect = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<h3 class="h3">Chọn chủ tịch hội đồng</h3>

		<div class="input-group grid-cols-[auto_1fr_auto]">
			<div class="ig-cell preset-tonal"><Search /></div>
			<input type="text" placeholder="Tìm kiếm..." bind:value={searchQuery} class="ig-input" />
		</div>

		<div class="max-h-[60vh] overflow-y-auto">
			{#if filteredUsers.length > 0}
				<div class="divide-y border rounded-container-token">
					{#each filteredUsers as user}
						<button
							type="button"
							class="w-full p-4 flex justify-between cursor-pointer"
							class:bg-primary-100={selectedUser?.id === user.id}
							class:text-primary-900={selectedUser?.id === user.id}
							onclick={() => {
								selectedUser = user;
								openUserSelect = false;
							}}
						>
							<div class="text-left">
								<p class="font-medium">{user.fullName}</p>
								<p
									class="text-sm"
									class:text-primary-700={selectedUser?.id === user.id}
									class:text-gray-500={selectedUser?.id !== user.id}
								>
									{user.username}
								</p>
							</div>
							{#if selectedUser?.id === user.id}
								<span class="text-primary-500">✓</span>
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<p class="text-gray-500 text-center p-4">Không tìm thấy ai</p>
			{/if}
		</div>

		<footer class="flex justify-end gap-4">
			<button type="button" class="btn preset-tonal" onclick={() => (openUserSelect = false)}>
				Đóng
			</button>
		</footer>
	{/snippet}
</Modal>
