<script lang="ts">
	import { page } from '$app/state';
	import { Plus } from 'lucide-svelte';
	import DeletePopup from './DeletePopup.svelte';
	const {
		headerText,
		data,
		presentation,
		detailButton = true,
		updateButton = true,
		deleteButton = true
	} = $props();

	// make a copy for display then remove id from data
	// display.filter((obj: any) => {
	// 	for (let key in obj) {
	// 		if (key === 'id') {
	// 			delete obj[key];
	// 		}
	// 	}
	// 	return true;
	// });
</script>

<div class="flex justify-between pb-6">
	<h2>{headerText}</h2>
	<a href="{page.url.pathname}/details/0/edit" class="btn preset-tonal-primary"><Plus /> Tạo mới</a>
</div>

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
					<td class="!text-right">
						{#if detailButton}
							<a class="btn preset-filled" href="{page.url.pathname}/details/{sub.id}">Chi tiết</a>
						{/if}
						{#if updateButton}
							<a
								class="btn preset-filled-primary-500"
								href="{page.url.pathname}/details/{sub.id}/edit">Sửa</a
							>
						{/if}
						{#if deleteButton}
							<DeletePopup id={sub.id} />
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
