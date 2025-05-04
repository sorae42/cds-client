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
	<h3 class="h3">Kỳ đánh giá</h3>
	<a href="/management/ratings/details/0/edit" class="btn preset-tonal-primary">
		<Plus />Tạo kỳ đánh giá
	</a>
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
						<span class="badge preset-outlined-surface-500">
							{period.units.length} đơn vị
						</span>
					</div>
				</span>
			{/snippet}
			{#snippet panel()}
				<div class="space-y-4">
					<div class="flex justify-end gap-2">
						<a class="btn preset-filled" href="/management/ratings/details/{period.id}"
							><Info />Chi tiết</a
						>
						<a
							class="btn preset-filled-primary-500"
							href="/management/ratings/details/{period.id}/edit"
						>
							<Pencil />Chỉnh sửa
						</a>
						{#if period.isLocked}
							<button class="btn preset-tonal-primary" onclick={() => handleUnlockPeriod(period)}>
								<Lock />Mở khoá
							</button>
						{:else}
							<button class="btn preset-tonal-primary" onclick={() => handleLockPeriod(period)}>
								<Unlock />Khoá
							</button>
						{/if}
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

<!-- Modal for locking period -->
<Modal
	open={openLockModal}
	onOpenChange={(e: { open: boolean }) => (openLockModal = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form action="?/lockPeriod" method="POST" enctype="multipart/form-data">
			<article class="space-y-4">
				<TextInput name="reason" label="Lý do:" required />
				<TextInput name="unlockDate" label="Ngày mở khoá:" type="datetime-local" required />
				<div class="form-group">
					<label for="attachment">File đính kèm (PDF):</label>
					<input type="file" id="attachment" name="attachment" accept=".pdf" class="input" />
				</div>
				<input type="hidden" name="period" value={currentPeriodId} />
			</article>
			<footer class="flex justify-between gap-4 mt-4">
				<button type="button" class="btn preset-tonal" onclick={() => (openLockModal = false)}>
					Huỷ
				</button>
				<button type="submit" class="btn preset-filled">
					<Lock />Khoá kỳ đánh giá
				</button>
			</footer>
		</form>
	{/snippet}
</Modal>

<!-- Modal for unlocking period -->
<Modal
	open={openUnlockModal}
	onOpenChange={(e: { open: boolean }) => (openUnlockModal = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form action="?/unlockPeriod" method="POST">
			<article class="space-y-4">
				<TextInput name="reason" label="Lý do mở khoá:" required />
				<input type="hidden" name="period" value={currentPeriodId} />
			</article>
			<footer class="flex justify-between gap-4 mt-4">
				<button type="button" class="btn preset-tonal" onclick={() => (openUnlockModal = false)}>
					Huỷ
				</button>
				<button type="submit" class="btn preset-filled">
					<Unlock />Mở khoá kỳ đánh giá
				</button>
			</footer>
		</form>
	{/snippet}
</Modal>
