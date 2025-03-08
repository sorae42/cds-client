<script lang="ts">
	const {
		data,
		presentation,
		detailButton = true,
		updateButton = true,
		deleteButton = true
	} = $props();
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
					{#each Object.entries(sub) as [key, value], index (key)}
						<td>{value}</td>
					{/each}
					<!-- Action buttons -->
					<td class="!text-right">
						{#if detailButton}
							<a class="btn preset-filled" href="/details/{sub.id}">Chi tiết</a>
						{/if}
						{#if updateButton}
							<button class="btn preset-filled-primary-500">Sửa</button>
						{/if}
						{#if deleteButton}
							<button class="btn preset-filled-error-500">Xoá</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
