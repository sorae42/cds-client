<script lang="ts">
	import { Info, SquareChevronDown, SquareChevronUp } from 'lucide-svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const periods = data.periods;
</script>

<div class="p-8">
	<div class="flex justify-between items-center mb-8">
		<h3 class="h3">Đánh giá tiêu chí</h3>
	</div>

	{#if periods.length === 0}
		<div class="text-center py-12">
			<Info class="w-16 h-16 text-surface-400 mx-auto mb-4" />
			<h4 class="h4 text-surface-600-300 mb-2">Chưa có kỳ đánh giá nào</h4>
			<p class="text-surface-500">Bạn chưa được phân công đánh giá tiêu chí nào.</p>
		</div>
	{:else}
		<Accordion multiple collapsible classes="space-y-4">
			{#snippet iconOpen()}
				<SquareChevronUp />
			{/snippet}
			{#snippet iconClosed()}
				<SquareChevronDown />
			{/snippet}
			{#each periods as period}
				<Accordion.Item
					value={period.id}
					controlClasses="font-bold"
					classes="border border-gray-400 rounded-sm"
				>
					{#snippet control()}
						<span class="flex justify-between items-center">
							<span class="flex items-center gap-2">
								{period.name}
							</span>
							<div class="flex gap-2">
								<span class="badge preset-outlined-surface-500">
									{new Date(period.startDate).toLocaleDateString('vi-VN')} - {new Date(
										period.endDate
									).toLocaleDateString('vi-VN')}
								</span>
								<span class="badge preset-outlined-primary-500">
									{period.subCriterias?.length || 0} tiêu chí được gán
								</span>
							</div>
						</span>
					{/snippet}
					{#snippet panel()}
						<div class="space-y-4">
							<!-- Stats -->
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div class="card p-4 text-center">
									<p class="text-2xl font-bold text-primary-500">{period.subCriterias?.length || 0}</p>
									<p class="text-sm text-surface-600-300">Tổng tiêu chí</p>
								</div>
								<div class="card p-4 text-center">
									<p class="text-2xl font-bold text-success-500">
										{period.subCriterias?.filter((sc: any) => sc.assignment?.score !== null).length || 0}
									</p>
									<p class="text-sm text-surface-600-300">Đã đánh giá</p>
								</div>
								<div class="card p-4 text-center">
									<p class="text-2xl font-bold text-warning-500">
										{period.subCriterias?.filter((sc: any) => sc.assignment?.score === null).length || 0}
									</p>
									<p class="text-sm text-surface-600-300">Chưa đánh giá</p>
								</div>
							</div>

							<!-- Action Button -->
							<div class="flex justify-end gap-2">
								<a class="btn preset-filled" href="/reviews/details/{period.id}">
									<Info />Chi tiết & Đánh giá
								</a>
							</div>
						</div>
					{/snippet}
				</Accordion.Item>
			{/each}
		</Accordion>
	{/if}
</div>