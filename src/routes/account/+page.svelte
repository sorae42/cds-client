<script lang="ts">
	import TextInput from '$lib/crud/TextInput.svelte';
	import { enhance } from '$app/forms';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { Check, X } from 'lucide-svelte';

	const { data } = $props();
	let is2FAEnabled = $state(data.user.isTwoFactorEnabled || false);
    let twofa: HTMLFormElement;
</script>

<div class="p-4 space-y-8">
	<!-- User Info Card -->
	<div class="p-4">
		<header class="mb-4">
			<h3 class="h3">Thông tin cá nhân</h3>
		</header>

		<!-- User Info Section -->
		<div class="mb-8 space-y-2">
			<div>
				<strong>Tên đăng nhập:</strong>
				{data.user.username}
			</div>
			<div>
				<strong>Vai trò:</strong>
				{data.user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
			</div>
			{#if data.user.unit}
				<div>
					<strong>Đơn vị:</strong>
					{data.user.unit.name}
				</div>
			{/if}
		</div>

		<!-- Profile Edit Form -->
		<form method="POST" action="?/updateProfile" class="space-y-4" use:enhance>
			<TextInput name="fullName" label="Họ và tên" value={data.user.fullName} required />

			<TextInput name="email" type="email" label="Email" value={data.user.email} required />

			<TextInput name="phone" label="Số điện thoại" value={data.user.phone} required />

			<footer class="flex justify-end gap-2">
				<button type="submit" class="btn preset-filled"> Lưu thay đổi </button>
			</footer>
		</form>
	</div>
	<hr />
    <div class="flex flex-row gap-4 justify-evenly [&>div]:w-full">
        <div class="px-2">
            <header class="mb-4">
                <h3 class="h3">Đổi mật khẩu</h3>
            </header>
    
            <form method="POST" action="?/changePassword" class="space-y-4" use:enhance>
                <TextInput name="oldPassword" type="password" label="Mật khẩu cũ" required />
    
                <TextInput name="newPassword" type="password" label="Mật khẩu mới" required />
                <small class="text-surface-600">* Mật khẩu phải có ít nhất 6 ký tự</small>
    
                <footer class="flex justify-end gap-2">
                    <button type="submit" class="btn preset-filled"> Đổi mật khẩu </button>
                </footer>
            </form>
        </div>
        <span class=""></span>
        <div>
            <header class="mb-4">
                <h3 class="h3">Xác thực 2 bước</h3>
            </header>

            <div class="space-y-4">
                <p class="text-surface-600">
                    Xác thực 2 bước giúp bảo vệ tài khoản của bạn bằng cách yêu cầu một mã bổ sung khi đăng nhập.
                </p>

                <form
                    bind:this={twofa}
                    method="POST" 
                    action="?/toggle2FA"
                    use:enhance={() => {
                        return async ({ result }) => {
                            if (result.type === 'success') {
                                is2FAEnabled = !is2FAEnabled;
                            }
                        };
                    }}
                >
                    <input type="hidden" name="enabled" value={!is2FAEnabled} />
                    <div class="flex items-center gap-4">
                        <Switch 
                            name="2fa"
                            checked={is2FAEnabled}
                            onCheckedChange={(e) => {
                                twofa.requestSubmit();
                            }}
                            controlActive="bg-success-500"
                        >
                            {#snippet inactiveChild()}
                                <X size="14" />
                            {/snippet}
                            {#snippet activeChild()}
                                <Check size="14" />
                            {/snippet}
                        </Switch>
                        <span>Xác thực 2 bước</span>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
