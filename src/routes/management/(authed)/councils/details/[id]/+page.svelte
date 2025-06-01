<script lang="ts">
	import { UserCircle, Plus, Search, ArrowLeft } from 'lucide-svelte';
	import CRUDTable from '$lib/CRUDTable.svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let council = data.council;
	let openUserSelect = $state(false);
	let searchQuery = $state('');
	let selectedUser = $state<any>(null);

	// Transform members data for CRUDTable
	const memberTableData = council.members.map((member: any) => ({
		id: member.id,
		name: member.fullName,
		username: member.username
	}));

	// Filter users based on search
	const filteredUsers = $derived(
		searchQuery
			? data.availableUsers.filter(
					(user: any) =>
						user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
						user.username.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: data.availableUsers
	);

	function handleModalClose() {
		openUserSelect = false;
		searchQuery = '';
		selectedUser = null;
	}
</script>

<div class="p-8 space-y-8">
	<div class="flex items-center gap-4">
		<a href="../" class="btn preset-outlined-surface-500">
			<ArrowLeft />
		</a>
		<h3 class="h3">Chi tiết hội đồng thẩm định</h3>
	</div>

	<div class="card p-4 space-y-4">
		<h4 class="h4">Thông tin chung</h4>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<strong>Tên hội đồng:</strong>
				{council.name}
			</div>
			<div>
				<strong>Ngày tạo:</strong>
				{new Date(council.createdAt).toLocaleDateString('vi-VN')}
			</div>
			<div>
				<strong>Chủ tịch:</strong>
				{#if council.chair}
					<span class="flex items-center gap-2">
						<UserCircle size={16} />
						{council.chair.fullName} ({council.chair.username})
					</span>
				{:else}
					<span class="text-gray-500">Chưa có chủ tịch</span>
				{/if}
			</div>
			{#if council.description}
				<div>
					<strong>Mô tả:</strong>
					{council.description}
				</div>
			{/if}
		</div>
	</div>

	<div class="card p-4">
		<div class="flex justify-between items-center mb-4">
			<h4 class="h4">Thành viên hội đồng ({council.members.length})</h4>
			<button class="btn preset-tonal-primary" onclick={() => (openUserSelect = true)}>
				<Plus />Thêm thành viên
			</button>
		</div>
		<CRUDTable
			data={memberTableData}
			presentation={['Tên thành viên', 'Tên đăng nhập']}
			dataBody={['name', 'username']}
			updateButton={false}
			deleteButton={false}
		/>
	</div>

	<Modal
		open={openUserSelect}
		onOpenChange={(e) => (e.open ? (openUserSelect = true) : handleModalClose())}
		triggerBase="btn preset-tonal"
		contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl"
		backdropClasses="backdrop-blur-sm"
	>
		{#snippet content()}
			<h3 class="h3">Chọn thành viên để thêm vào hội đồng</h3>

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
								onclick={() => (selectedUser = selectedUser?.id === user.id ? null : user)}
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
					<p class="text-gray-500 text-center p-4">Không tìm thấy người dùng phù hợp</p>
				{/if}
			</div>

			<footer class="flex justify-between gap-4">
				<button type="button" class="btn preset-tonal" onclick={handleModalClose}> Huỷ </button>
				<form
					action="?/addReviewer"
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								handleModalClose();
								window.location.reload();
							}
						};
					}}
				>
					<input type="hidden" name="userId" value={selectedUser?.id} />
					<button type="submit" class="btn preset-filled" disabled={!selectedUser}>
						Thêm thành viên
					</button>
				</form>
			</footer>
		{/snippet}
	</Modal>
</div>
