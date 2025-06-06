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
		ChevronDown,
		Bell,
		X
	} from 'lucide-svelte';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import { Toaster } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster';
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	let { children, data }: LayoutProps = $props();

	const routeThatHideNavbar = ['/auth', '/', '/search'];

	let appbarTransparency = $state(false);
	let isLoggedIn = $derived(data.user && data.user.id);
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

	let drawerState = $state(false);

	function drawerToggle(state: boolean) {
		drawerState = state;
	}

	function formatTimestamp(timestamp: string) {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

		if (diffInHours < 1) {
			const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
			return `${diffInMinutes} phút trước`;
		} else if (diffInHours < 24) {
			return `${diffInHours} giờ trước`;
		} else {
			return date.toLocaleDateString('vi-VN', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		}
	}
</script>

<Toaster {toaster}></Toaster>
<AppBar classes="fixed {appbarTransparency ? 'bg-transparent' : ''} duration-300 z-[10]">
	{#snippet trail()}
		{#if page.url.pathname !== '/search'}
			<!-- <a href="/search" class="btn preset-outlined px-10">
				<Search />
				<span>Tìm kiếm kết quả</span>
			</a> -->
		{/if}
		{#if !isLoggedIn}
			<a href="/auth" class="btn preset-filled">
				<span>Đăng nhập</span>
				<LogIn />
			</a>
		{:else}
			<button class="btn preset-tonal" onclick={() => drawerToggle(true)}>
				<Bell />
			</button>
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
					<span>{data.user?.fullName || data.user?.username || 'Người dùng'}</span>
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

<Modal
	open={drawerState}
	onOpenChange={(e) => (drawerState = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="bg-surface-100-900 space-y-4 shadow-xl w-[480px] h-screen"
	positionerJustify="justify-end"
	positionerAlign=""
	positionerPadding=""
	transitionsPositionerIn={{ x: 480, duration: 200 }}
	transitionsPositionerOut={{ x: 480, duration: 200 }}
>
	{#snippet content()}
		<div class="h-full flex flex-col">
			<!-- Header -->
			<div class="flex items-center justify-between mb-4 p-4 bg-surface-200">
				<button
					class="btn preset-outlined-surface-500 w-[42px] p-0"
					onclick={() => drawerToggle(false)}
				>
					<X />
				</button>
				<span>{data.notification?.length || 0} thông báo </span>
			</div>

			<!-- Notifications List -->
			<div class="flex-1 overflow-y-auto space-y-3 px-4">
				{#if data.notification && data.notification.length > 0}
					{#each data.notification as notification}
						<div
							class="p-3 border border-surface-300-600 rounded-lg hover:bg-surface-50-950 transition-colors"
						>
							<!-- Action and Time -->
							<div class="flex justify-between items-center mb-2">
								<span class="font-bold text-sm">{notification.action}</span>
								<span class="text-xs text-surface-500">
									{formatTimestamp(notification.timestamp)}
								</span>
							</div>
							<!-- Description -->
							<p class="text-sm text-surface-600-300 leading-relaxed">
								{notification.description}
							</p>
						</div>
					{/each}
				{:else}
					<div class="flex flex-col items-center justify-center py-12">
						<Bell class="w-12 h-12 text-surface-400 mb-3" />
						<p class="text-surface-500 text-center">Không có thông báo nào</p>
					</div>
				{/if}
			</div>
		</div>
	{/snippet}
</Modal>

<svelte:window bind:scrollY on:scroll={checkScroll} />
