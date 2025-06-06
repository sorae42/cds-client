<script lang="ts">
	import { ArrowLeft, Crown, Users, FileText, MapPin, User, CheckCircle, Plus, Search } from 'lucide-svelte';
	import { Accordion, Modal } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';
	import { toaster } from '$lib/toaster.js';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { currentUser, allReviewers, availableUsers } = data;

	// Modal state for adding new members
	let openUserSelect = $state(false);
	let searchQuery = $state('');
	let selectedUser = $state<any>(null);

	// Calculate statistics
	const totalReviewers = allReviewers.length;
	const totalAssignments = allReviewers.reduce((sum: number, reviewer: any) => 
		sum + (reviewer.assignments?.length || 0), 0);
	const reviewersWithAssignments = allReviewers.filter((reviewer: any) => 
		reviewer.assignments && reviewer.assignments.length > 0).length;

	// Filter users based on search
	const filteredUsers = $derived(
		searchQuery
			? availableUsers.filter(
					(user: any) =>
						user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
						user.username.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: availableUsers
	);

	function handleModalClose() {
		openUserSelect = false;
		searchQuery = '';
		selectedUser = null;
	}
</script>

<div class="p-8 space-y-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="/finalreviews" class="btn preset-outlined-surface-500">
			<ArrowLeft />
		</a>
		<div class="flex items-center gap-2">
			<Crown class="text-yellow-500" />
			<h3 class="h3">Quản lý hội đồng thẩm định</h3>
		</div>
	</div>

	<!-- Chairman Info -->
	<div class="card p-4">
		<h4 class="h4 mb-4 flex items-center gap-2">
			<Crown class="text-yellow-500" />
			Thông tin chủ tịch
		</h4>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<strong>Họ tên:</strong>
				{currentUser.fullName || 'Chưa cập nhật'}
			</div>
			<div>
				<strong>Tên đăng nhập:</strong>
				{currentUser.username}
			</div>
			<div>
				<strong>Vai trò:</strong>
				<span class="badge preset-outlined-warning-500">Chủ tịch hội đồng</span>
			</div>
		</div>
	</div>

	<!-- Statistics -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-primary-500">{totalReviewers}</p>
			<p class="text-sm text-surface-600-300">Tổng thành viên</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-success-500">{totalAssignments}</p>
			<p class="text-sm text-surface-600-300">Tổng nhiệm vụ</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-warning-500">{reviewersWithAssignments}</p>
			<p class="text-sm text-surface-600-300">Thành viên có nhiệm vụ</p>
		</div>
	</div>

	<!-- All Reviewers -->
	<div class="card p-4">
		<div class="flex justify-between items-center mb-4">
			<h4 class="h4 flex items-center gap-2">
				<Users />
				Danh sách thành viên và nhiệm vụ ({totalReviewers})
			</h4>
			<button class="btn preset-tonal-primary" onclick={() => (openUserSelect = true)}>
				<Plus />Thêm thành viên
			</button>
		</div>

		<Accordion multiple collapsible>
			{#snippet iconOpen()}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
				</svg>
			{/snippet}
			{#snippet iconClosed()}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
				</svg>
			{/snippet}
			
			{#each allReviewers as reviewer, index}
				<Accordion.Item
					value={`reviewer-${reviewer.reviewerId}`}
					controlClasses="font-bold"
					classes="border border-gray-400 rounded-sm mb-2"
				>
					{#snippet control()}
						<span class="flex justify-between items-center w-full">
							<span class="flex items-center gap-2">
								{#if reviewer.isChair}
									<Crown size={20} class="text-yellow-500" />
								{:else}
									<User size={20} class="text-blue-500" />
								{/if}
								<span>{reviewer.fullName || reviewer.username}</span>
								{#if reviewer.isChair}
									<span class="badge preset-outlined-warning-500">Chủ tịch</span>
								{/if}
							</span>
							<div class="flex gap-2">
								<span class="badge preset-outlined-surface-500">
									{reviewer.assignments?.length || 0} nhiệm vụ
								</span>
								{#if reviewer.assignments && reviewer.assignments.length > 0}
									<CheckCircle size={16} class="text-success-500" />
								{/if}
							</div>
						</span>
					{/snippet}
					{#snippet panel()}
						<div class="p-4 space-y-4">
							<div class="flex justify-between items-center">
								<div class="text-sm text-surface-600-300">
									{#if reviewer.assignments && reviewer.assignments.length > 0}
										Thành viên này có {reviewer.assignments.length} nhiệm vụ được phân công
									{:else}
										Chưa có nhiệm vụ nào được phân công
									{/if}
								</div>
								<a
									href="/finalreviews/maiden/{$page.params.id}/ratings/{reviewer.reviewerId}"
									class="btn preset-filled-primary-500"
								>
									<FileText size={16} />
									Xem chi tiết đánh giá
								</a>
							</div>
						</div>
					{/snippet}
				</Accordion.Item>
			{/each}
		</Accordion>
	</div>

	<!-- Member Assignment Modal -->
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
							if (result.type === 'failure') {
								toaster.error({
									title: result.data?.message || 'Thêm thành viên thất bại',
								});
								return;
							}
							if (result.type === 'success') {
								handleModalClose();
								toaster.success({
									title: 'Thêm thành viên thành công!',
								});
								invalidateAll();
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