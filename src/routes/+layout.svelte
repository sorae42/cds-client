<script lang="ts">
	import '../app.css';
	import { AppBar, ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import Navbar from '$lib/Navbar.svelte';
	import { LogIn, LogOut, Search } from 'lucide-svelte';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';

	let { children, data }: LayoutProps = $props();

	const routeThatHideNavbar = ['/auth', '/', '/search'];

	let appbarTransparency = $state(false);
	let scrollY = $state(0);

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
			<a href="/search" class="btn preset-outlined px-10">
				<Search />
				<span>Tìm kiếm kết quả</span>
			</a>
		{/if}
		{#if !data.token}
			<a href="/auth" class="btn preset-filled">
				<span>Đăng nhập</span>
				<LogIn />
			</a>
		{:else}
			<a href="/auth/logout" class="btn preset-outlined-error-500">
				<span>Đăng xuất</span>
				<LogOut />
			</a>
		{/if}
	{/snippet}
	{#snippet lead()}
		<h4 class="h4"><a href="/" class="hover:!underline">Hệ thống đánh giá chuyển đổi số</a></h4>
	{/snippet}
</AppBar>

<div class="border-surface-100-900 bg-white w-full h-full flex">
	{#if !routeThatHideNavbar.includes(page.url.pathname)}
		<div class="w-100"></div>
		<Navbar />
	{/if}
	<div class="{page.url.pathname === '/' ? '' : 'pt-16'} !bg-white w-full">
		<ToastProvider>
			{@render children()}
		</ToastProvider>
	</div>
</div>

<svelte:window bind:scrollY on:scroll={checkScroll} />
