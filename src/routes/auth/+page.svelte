<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Info, Lock, KeyRound, TriangleAlertIcon, User } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let message = $state('');
	let success = $state(true);
	let isVerifyOtp = $state(false);
	let username = $state('');

	const redirectTo = page.url.searchParams.get('redirectTo');
</script>

<div class="flex flex-col justify-center items-center w-screen h-full p-10">
	<div class="card w-full bg-surface-100-900 p-10 space-y-4 shadow-xl max-w-screen-sm">
		<h3 class="h3 text-center">{!isVerifyOtp ? 'Đăng nhập vào hệ thống' : 'Xác thực 2 bước'}</h3>
		<form
			action={!isVerifyOtp ? '?/login' : '?/verifyOtp'}
			method="post"
			class="[&>div>*]:mt-6 text-center"
			use:enhance={() => {
				return async ({ result }: { result: any }) => {
					success = result.data.success;
					message = result.data.message;

					if (result.data.needOtp) {
						username = result.data.username;
						isVerifyOtp = true;
						return;
					}

					if (success && message.includes('REDIRECT')) {
						window.location.replace(result.data.location);
					}
				};
			}}
		>
			{#if !isVerifyOtp}
				<div transition:slide>
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
				</div>
			{:else}
				<div transition:slide>
					<input type="hidden" name="username" value={username} />
					<div class="input-group grid-cols-[auto_1fr_auto]">
						<div class="ig-cell preset-tonal">
							<KeyRound size={16} />
						</div>
						<input
							class="ig-input"
							type="text"
							name="otp"
							placeholder="Nhập mã xác thực"
							inputmode="numeric"
							pattern="[0-9]*"
							maxlength="6"
							required
						/>
					</div>
					<div class="flex justify-between">
						<div class="flex items-center gap-2">
							<input type="checkbox" name="remember" id="remember" class="ig-checkbox" />
							<label for="remember" class="ig-label">Ghi nhớ thiết bị trong vòng 1 tháng</label>
						</div>
						<button type="submit" class="btn preset-filled">Xác nhận</button>
					</div>
				</div>
			{/if}
		</form>
	</div>
</div>
