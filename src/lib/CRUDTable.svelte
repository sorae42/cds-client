<script lang="ts">
	import { page } from '$app/state';
	import { SquareChevronDown, SquareChevronUp, Info, Pencil } from 'lucide-svelte';
	import DeletePopup from './DeletePopup.svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	const {
		data,
		presentation,
		dataBody,
		detailButton = true,
		updateButton = true,
		deleteButton = true
	} = $props();

	console.log(presentation, dataBody);

	// make a copy for display then replace id with counter numbers
	let display = data;

	let counter = 0;
	display.filter((obj: any) => {
		counter++;
		obj.id = counter;
		return obj;
	});
</script>

<div class="d-head px-4 py-1" style="--length:{presentation.length}">
	<span>#</span>
	{#each presentation as text}
		<span>{text}</span>
	{/each}
	<span></span>
</div>
<hr />
<Accordion multiple collapsible>
	{#snippet iconOpen()}
		<SquareChevronUp />
	{/snippet}
	{#snippet iconClosed()}
		<SquareChevronDown />
	{/snippet}
	{#each data as sub}
		<Accordion.Item value={sub.id} headingElement="span">
			{#snippet control()}
				<div class="d-content" style="--length:{presentation.length}">
					{#each Object.entries(sub) as [key, value]}
						<span class="w-fit">{value}</span>
					{/each}
				</div>
			{/snippet}
			{#snippet panel()}
				<div></div>
				<div class="!text-right flex gap-2 justify-end">
					{#if detailButton}
						<a class="btn preset-filled" href="{page.url.pathname}/details/{sub.id}"
							><Info />Chi tiết</a
						>
					{/if}
					{#if updateButton}
						<a
							class="btn preset-filled-primary-500"
							href="{page.url.pathname}/details/{sub.id}/edit"><Pencil />Chỉnh sửa</a
						>
					{/if}
					{#if deleteButton}
						<DeletePopup id={sub.id} />
					{/if}
				</div>
			{/snippet}
		</Accordion.Item>
		<hr />
	{/each}
</Accordion>

<style>
	.d-head {
		display: grid;
		justify-content: space-between;
		font-weight: bold;
		grid-template-columns: 24px repeat(var(--length), 1fr) 2.5em;
	}

	.d-content {
		display: grid;
		justify-content: space-between;
		grid-template-columns: 24px repeat(var(--length), 1fr);
	}
</style>
