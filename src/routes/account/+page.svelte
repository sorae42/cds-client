<script lang="ts">
    import TextInput from '$lib/crud/TextInput.svelte';

    const { data } = $props();
</script>

<div class="p-8">
    <div class="card p-4">
        <header class="mb-4">
            <h3 class="h3">Thông tin tài khoản</h3>
        </header>

        <!-- User Info Section -->
        <div class="mb-8 space-y-2">
            <div>
                <strong>Tên đăng nhập:</strong> {data.user.username}
            </div>
            <div>
                <strong>Vai trò:</strong> {data.user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            </div>
            {#if data.user.unit}
                <div>
                    <strong>Đơn vị:</strong> {data.user.unit.name}
                </div>
            {/if}
        </div>

        <!-- Edit Form -->
        <form 
            method="POST" 
            action="?/updateProfile" 
            class="space-y-4"
        >
            <TextInput 
                name="fullName"
                label="Họ và tên"
                value={data.user.fullName}
                required
            />

            <TextInput 
                name="email"
                type="email"
                label="Email"
                value={data.user.email}
                required
            />

            <TextInput 
                name="phone"
                label="Số điện thoại"
                value={data.user.phone}
                required
            />

            <div class="border-t border-surface-300-600 pt-4">
                <h4 class="h4 mb-4">Đổi mật khẩu</h4>
                <div class="space-y-4">
                    <TextInput 
                        name="oldPassword"
                        type="password"
                        label="Mật khẩu cũ"
                    />

                    <TextInput 
                        name="newPassword"
                        type="password"
                        label="Mật khẩu mới"
                    />
                    <small class="text-surface-600">* Mật khẩu phải có ít nhất 6 ký tự</small>
                </div>
            </div>

            <footer class="flex justify-end gap-2 pt-4">
                <button type="submit" class="btn preset-filled">
                    Lưu thay đổi
                </button>
            </footer>
        </form>
    </div>
</div>