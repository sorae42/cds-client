<script lang="ts">
	import { page } from '$app/state';
	import { Info, Pencil } from 'lucide-svelte';
	import DeletePopup from './DeletePopup.svelte';
	const {
		data,
		presentation,
		detailButton = true,
		updateButton = true,
		deleteButton = true
	} = $props();

	// make a copy for display then replace id with counter numbers
	let display = data;
	let counter = 0;
	display.filter((obj: any) => {
		counter++;
		obj.id = counter;
		return obj;
	});
</script>

<div class="table-wrap">
	<table class="table caption-bottom">
		<thead>
			<tr>
				{#each presentation as text}
					<th>{text}</th>
				{/each}
				<th class="!text-right">Thao tác</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each data as sub}
				<tr>
					{#each Object.entries(sub) as [key, value]}
						<td>{value}</td>
					{/each}
					<!-- Action buttons -->
					<td class="!text-right flex flex-col gap-2">
						{#if detailButton}
							<a class="btn preset-filled" href="{page.url.pathname}/details/{sub.id}"><Info /></a>
						{/if}
						<span class="flex gap-2 justify-end">
							{#if updateButton}
								<a
									class="btn preset-filled-primary-500"
									href="{page.url.pathname}/details/{sub.id}/edit"><Pencil /></a
								>
							{/if}
							{#if deleteButton}
								<DeletePopup id={sub.id} />
							{/if}
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
