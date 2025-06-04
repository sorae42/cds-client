<script lang="ts">
	import { enhance } from '$app/forms';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { CheckIcon, LoaderCircle, Plus, Search } from 'lucide-svelte';
	import type { User } from '$lib/types/User';
	import { page } from '$app/state';

	const { users = [] } = $props();
	let openState = $state(false);
	let selectedUser = $state<User | null>(null);
	let isProcessing = $state(false);

	function modalClose() {
		openState = false;
		selectedUser = null; // Reset selection when closing
	}

	function selectUser(user: User) {
		selectedUser = selectedUser?.id === user.id ? null : user; // Toggle selection
	}

	function handleSubmit() {
		isProcessing = true;
		setTimeout(() => {
			modalClose();
			window.location.assign(page.url.pathname);
		}, 1420);
	}
</script>

<Modal
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	triggerBase="btn preset-tonal-primary"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}<Plus /> Thêm mới{/snippet}
	{#snippet content()}
		<article class="space-y-4">
			<h3 class="h3">Chọn người dùng để thêm vào đơn vị</h3>

			<!-- <form action="?/searchUser" method="POST" use:enhance>
				<div class="input-group grid-cols-[auto_1fr_auto]">
					<div class="ig-cell preset-tonal">
						<Search size={16} />
					</div>
					<input
						class="ig-input"
						type="search"
						name="search"
						placeholder="Tìm kiếm người dùng..."
					/>
					<button type="submit" class="ig-btn preset-filled">Tìm</button>
				</div>
			</form> -->

			<div class="overflow-y-auto">
				{#if users.length > 0}
					<div class="divide-y">
						{#each users as user}
							<div
								class="p-4 flex items-center justify-between hover:bg-surface-hover cursor-pointer transition-colors"
								class:bg-primary-100={selectedUser?.id === user.id}
								class:text-primary-900={selectedUser?.id === user.id}
								onclick={() => selectUser(user)}
								onkeydown={(e) => e.key === 'Enter' && selectUser(user)}
								role="button"
								tabindex="0"
							>
								<div>
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
									<CheckIcon />
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 text-center p-4">Không có người dùng nào khả dụng</p>
				{/if}
			</div>
		</article>

		<footer class="flex justify-between gap-4 mt-4">
			<button type="button" class="btn preset-tonal" onclick={modalClose}>Huỷ</button>
			<form action="?/addUser" method="POST" use:enhance={handleSubmit}>
				<input type="hidden" name="userId" value={selectedUser?.id} />
				{#if !isProcessing}
					<button type="submit" class="btn preset-filled" disabled={!selectedUser}>
						Thêm người dùng
					</button>
				{:else}
					<span class="flex gap-4"><LoaderCircle class="animate-spin" />Đang thêm...</span>
				{/if}
			</form>
		</footer>
	{/snippet}
</Modal>
