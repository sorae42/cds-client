<script lang="ts">
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
	import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Ellipsis } from 'lucide-svelte';

	const {
		data,
		page,
		pageSize,
        count,
		onPageChange,
		onPageSizeChange
	}: {
		data: any[];
		page: number;
		pageSize: number;
        count: number;
		onPageChange: (event: { page: number }) => void;
		onPageSizeChange: (event: { pageSize: number }) => void;
	} = $props();

	const pageSizeOptions = [10, 25, 50, 100];

	function handlePageSizeChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		onPageSizeChange({ pageSize: Number(select.value) });
	}
</script>

<footer class="flex justify-between items-center w-full gap-4 my-4">
	<select value={pageSize} onchange={handlePageSizeChange} class="select max-w-[150px]">
		{#each pageSizeOptions as size}
			<option value={size}>{size} mục</option>
		{/each}
	</select>

	<Pagination {data} {page} {onPageChange} {pageSize} {onPageSizeChange} {count}>
		{#snippet labelEllipsis()}<Ellipsis class="size-4" />{/snippet}
		{#snippet labelNext()}<ChevronRight class="size-4" />{/snippet}
		{#snippet labelPrevious()}<ChevronLeft class="size-4" />{/snippet}
		{#snippet labelFirst()}<ChevronFirst class="size-4" />{/snippet}
		{#snippet labelLast()}<ChevronLast class="size-4" />{/snippet}
	</Pagination>
</footer>
