<script lang="ts">
	import { enhance } from '$app/forms';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { Lock, LogIn, User } from 'lucide-svelte';

	let { cancellable = true } = $props();
	let openState = $state(false);

	function closeModal() {
		openState = false;
	}


</script>

<Modal
	bind:open={openState}
	triggerBase="btn preset-filled"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
	closeOnEscape={cancellable}
	closeOnInteractOutside={cancellable}
>
	{#snippet trigger()}
		<span>Đăng nhập</span>
		<LogIn />
	{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h3 class="h3">Đăng nhập vào hệ thống</h3>
		</header>
		<form action="?/login" method="post" class="[&>*]:mt-4" use:enhance>
			<div class="input-group grid-cols-[auto_1fr_auto]">
				<div class="ig-cell preset-tonal">
					<User size={16} />
				</div>
				<input class="ig-input" type="text" name="username" placeholder="Tên người dùng" required />
			</div>
			<div class="input-group grid-cols-[auto_1fr_auto]">
				<div class="ig-cell preset-tonal">
					<Lock size={16} />
				</div>
				<input class="ig-input" type="text" name="password" placeholder="Mật khẩu" required />
			</div>
			<div class="input-group w-full">
				<button type="submit" class="btn preset-filled">Đăng nhập</button>
			</div>
			{#if cancellable}
				<div class="input-group w-full">
					<button type="button" class="btn preset-tonal" onclick={closeModal}>Huỷ</button>
				</div>
			{/if}
		</form>
	{/snippet}
</Modal>
