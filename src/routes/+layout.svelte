<script lang="ts">
	import '../app.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import Navbar from '$lib/Navbar.svelte';
	import { LogIn, LogOut } from 'lucide-svelte';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';

	let { children, data }: LayoutProps = $props();
</script>

<AppBar classes="fixed">
	{#snippet trail()}
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
	<span>Đánh giá chuyển đổi số</span>
</AppBar>

<div class="card border-surface-100-900 grid w-full h-full grid-cols-[auto_1fr] border-[1px]">
	{#if page.url.pathname !== '/auth'}
		<Navbar />
	{/if}
	<div class="pt-16">
		{@render children()}
	</div>
</div>
