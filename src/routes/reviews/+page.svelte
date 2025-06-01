<script lang="ts">
	import {
		Pencil,
		Plus,
		SquareChevronDown,
		SquareChevronUp,
		Lock,
		Unlock,
		Eye,
		Info
	} from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { Accordion, Modal } from '@skeletonlabs/skeleton-svelte';
	import TextInput from '$lib/crud/TextInput.svelte';
	import CRUDTable from '$lib/CRUDTable.svelte';
	import Pagination from '$lib/Pagination.svelte';
	import { page } from '$app/state';

	let { data }: PageProps = $props();
	let periods: Array<any> = $state(data.data);
	let currentPage = $state(data.pagination.page);
	let pageSize = $state(data.pagination.pageSize);
	let currentPeriodId = $state<string>('');
	let openLockModal = $state(false);
	let openUnlockModal = $state(false);

	function handleLockPeriod(period: any) {
		currentPeriodId = period.id;
		openLockModal = true;
	}

	function handleUnlockPeriod(period: any) {
		currentPeriodId = period.id;
		openUnlockModal = true;
	}

	function handlePageChange(event: { page: number }) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', event.page.toString());
		window.location.assign(url.toString());
	}

	function handlePageSizeChange(event: { pageSize: number }) {
		const url = new URL(window.location.href);
		url.searchParams.set('pageSize', event.pageSize.toString());
		url.searchParams.set('page', '1');
		window.location.assign(url.toString());
	}
</script>

<div class="p-8 flex justify-between">
	<h3 class="h3">Chọn kỳ đánh giá</h3>
</div>

<Accordion multiple collapsible classes="p-8 pt-0">
	{#snippet iconOpen()}
		<SquareChevronUp />
	{/snippet}
	{#snippet iconClosed()}
		<SquareChevronDown />
	{/snippet}
	{#each periods as period}
		<Accordion.Item
			value={period.id}
			headingElement="span"
			controlClasses="font-bold"
			classes="border border-gray-400 rounded-sm"
		>
			{#snippet control()}
				<span class="flex justify-between items-center">
					<span class="flex items-center gap-2">
						{period.name}
						{#if period.isLocked}
							<span class="badge preset-tonal-error">Đã khoá</span>
						{/if}
					</span>
					<div class="flex gap-2">
						<span class="badge preset-outlined-surface-500">
							{new Date(period.startDate).toLocaleDateString('vi-VN')} - {new Date(
								period.endDate
							).toLocaleDateString('vi-VN')}
						</span>
					</div>
				</span>
			{/snippet}
			{#snippet panel()}
				<div class="space-y-4">
					<div class="flex justify-end gap-2">
						<a class="btn preset-filled" href="/reviews/details/{period.id}"
							><Info />Chi tiết & Đánh giá</a
						>
					</div>
				</div>
			{/snippet}
		</Accordion.Item>
	{/each}
</Accordion>

<div class="px-8">
	<Pagination
		data={periods}
		page={currentPage}
		{pageSize}
		count={data.pagination.totalCount}
		onPageChange={handlePageChange}
		onPageSizeChange={handlePageSizeChange}
	/>
</div>