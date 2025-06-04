<script lang="ts">
	import { page } from '$app/state';
	import { SquareChevronDown, SquareChevronUp, Info, Pencil } from 'lucide-svelte';
	import DeletePopup from './DeletePopup.svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	
	const {
		data,
		presentation,
		presentationSub = [],
		dataBody = [],
		dataSub = [],
		detailButton = true,
		updateButton = true,
		deleteButton = true
	} = $props();

	// Safely transform data without using structuredClone
	let display = data.map((obj: any) => ({
		id: obj.id,
		body: Object.fromEntries(dataBody.map((k) => [k, obj[k]])),
		sub: Object.fromEntries(dataSub.map((k) => [k, obj[k]]))
	}));
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
	{#each display as entry}
		<Accordion.Item value={entry.id}>
			{#snippet control()}
				<div class="d-content" style="--length:{presentation.length}">
					<span class="w-fit">{entry.id}</span>
					{#each Object.values(entry.body) as value}
						<span class="w-fit">{value}</span>
					{/each}
				</div>
			{/snippet}
			{#snippet panel()}
				<div>
					{#each presentationSub as label, i}
						<div>
							<strong>{label}</strong>: {entry.sub[Object.keys(entry.sub)[i]] || 'Chưa cung cấp'}
						</div>
					{/each}
				</div>
				<div class="!text-right flex gap-2 justify-end">
					{#if detailButton}
						<a class="btn preset-filled" href="{page.url.pathname}/details/{entry.id}"
							><Info />Chi tiết</a
						>
					{/if}
					{#if updateButton}
						<a
							class="btn preset-filled-primary-500"
							href="{page.url.pathname}/details/{entry.id}/edit"><Pencil />Chỉnh sửa</a
						>
					{/if}
					{#if deleteButton}
						<DeletePopup id={entry.id} />
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
		gap: 9px;
	}

	.d-content {
		display: grid;
		justify-content: space-between;
		grid-template-columns: 24px repeat(var(--length), 1fr);
		gap: 8px;
	}
</style>
