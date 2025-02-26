<script lang="ts">
	import '../app.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import LoginPrompt from '$lib/LoginPrompt.svelte';

	let { children } = $props();
</script>

<AppBar>
	{#snippet trail()}
		<LoginPrompt />
	{/snippet}
	<span></span>
</AppBar>

{@render children()}
