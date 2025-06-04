<script lang="ts">
	import '../app.css';
	import { AppBar, Popover } from '@skeletonlabs/skeleton-svelte';
	import Navbar from '$lib/Navbar.svelte';
	import {
		LogIn,
		LogOut,
		Search,
		UserCircle,
		User,
		FolderKanban,
		ChevronDown
	} from 'lucide-svelte';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';

	let { children, data }: LayoutProps = $props();

	const routeThatHideNavbar = ['/auth', '/', '/search'];

	let appbarTransparency = $state(false);
	let scrollY = $state(0);

	let openState = $state(false);

	$effect(() => {
		if (page.url.pathname === '/') appbarTransparency = true;
		else appbarTransparency = false;
	});

	function checkScroll() {
		if (page.url.pathname !== '/') return;
		if (scrollY < 42) appbarTransparency = true;
		else appbarTransparency = false;
	}
</script>

<AppBar classes="fixed {appbarTransparency ? 'bg-transparent' : ''} duration-300 z-[10]">
	{#snippet trail()}
		{#if page.url.pathname !== '/search'}
			<!-- <a href="/search" class="btn preset-outlined px-10">
				<Search />
				<span>Tìm kiếm kết quả</span>
			</a> -->
		{/if}
		{#if !data.token}
			<a href="/auth" class="btn preset-filled">
				<span>Đăng nhập</span>
				<LogIn />
			</a>
		{:else}
			<Popover
				open={openState}
				onOpenChange={(e) => (openState = e.open)}
				positioning={{ placement: 'bottom-end' }}
				triggerBase="btn preset-tonal"
				contentBase="card bg-white p-4 space-y-4 w-64 shadow-xl"
				arrow
				arrowBackground="!bg-white"
				zIndex="100"
			>
				{#snippet trigger()}
					<UserCircle />
					<span>{data.user?.fullName || 'Người dùng'}</span>
					<ChevronDown />
				{/snippet}
				{#snippet content()}
					<div class="flex flex-col gap-2">
						<a href="/overview" class="btn variant-soft w-full justify-start">
							<FolderKanban />
							<span>Bảng điều khiển</span>
						</a>
						<a href="/account" class="btn variant-soft w-full justify-start">
							<User />
							<span>Tài khoản</span>
						</a>
						<hr />
						<a href="/auth/logout" class="btn preset-filled-error-500 w-full justify-start">
							<LogOut />
							<span>Đăng xuất</span>
						</a>
					</div>
				{/snippet}
			</Popover>
		{/if}
	{/snippet}
	{#snippet lead()}
		<h4 class="h4"><a href="/" class="hover:!underline">Hệ thống đánh giá chuyển đổi số</a></h4>
	{/snippet}
</AppBar>

<div class="border-surface-100-900 bg-white w-full h-full flex">
	{#if !routeThatHideNavbar.includes(page.url.pathname)}
		<div class="w-100"></div>
		<Navbar isAdmin={data.user?.role === 'admin'} isChair={data.user?.isChairman === true} />
	{/if}
	<div class="{page.url.pathname === '/' ? '' : 'pt-16'} !bg-white w-full">
			{@render children()}
	</div>
</div>

<svelte:window bind:scrollY on:scroll={checkScroll} />
