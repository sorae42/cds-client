<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Info, Lock, Mail, TriangleAlertIcon, User } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let message = $state('');
	let success = $state(true);
	let forgotPassword = $state(false);

	const redirectTo = page.url.searchParams.get('redirectTo');

	function switchDialog() {
		forgotPassword = !forgotPassword;
	}
</script>

<div class="flex flex-col justify-center items-center w-screen h-full p-10">
	<div class="card w-full bg-surface-100-900 p-10 space-y-4 shadow-xl max-w-screen-sm">
		<h3 class="h3 text-center">{!forgotPassword ? 'Đăng nhập vào hệ thống' : 'Quên mật khẩu'}</h3>
		{#if redirectTo}
			<div class="card p-4 preset-outlined-warning-500 flex gap-4">
				<Info /> Bạn cần đăng nhập để tiếp tục
			</div>
		{/if}
		{#if !success}
			<div class="card p-4 preset-outlined-error-500 flex gap-4">
				<TriangleAlertIcon />{message}
			</div>
		{/if}

		<form
			action={!forgotPassword ? '?/login' : '?/reset'}
			method="post"
			class="[&>div>*]:mt-6 text-center"
			use:enhance={() => {
				return async ({ result, update }: { result: any; update: any }) => {
					success = result.data.success;
					message = result.data.message;
					if (success && message.includes('REDIRECT'))
						window.location.replace(result.data.location);
					update();
				};
			}}
		>
			{#if !forgotPassword}
				<div transition:slide>
					<div class="input-group grid-cols-[auto_1fr_auto]">
						<div class="ig-cell preset-tonal">
							<User size={16} />
						</div>
						<input
							class="ig-input"
							type="text"
							name="username"
							placeholder="Tên người dùng"
							required
						/>
					</div>
					<div class="input-group grid-cols-[auto_1fr_auto]">
						<div class="ig-cell preset-tonal">
							<Lock size={16} />
						</div>
						<input
							class="ig-input"
							type="password"
							name="password"
							placeholder="Mật khẩu"
							autocomplete="off"
							required
						/>
					</div>
					<div class="input-group w-full">
						<button type="submit" class="btn preset-filled">Đăng nhập</button>
					</div>
					<div class="text-center mt-4">
						<button type="button" class="underline" onclick={switchDialog}>Quên mật khẩu?</button>
					</div>
				</div>
			{:else}
				<div transition:slide>
					<div class="input-group grid-cols-[auto_1fr_auto]">
						<div class="ig-cell preset-tonal">
							<Mail size={16} />
						</div>
						<input class="ig-input" type="text" name="email" placeholder="Email" required />
					</div>
					<div>
						<button class="btn preset-filled w-full">Yêu cầu thay đổi mật khẩu</button>
					</div>
					<div>
						<button type="button" class="underline" onclick={switchDialog}>Đăng nhập</button>
					</div>
				</div>
			{/if}
		</form>
	</div>
</div>
