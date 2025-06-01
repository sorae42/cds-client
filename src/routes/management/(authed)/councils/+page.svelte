<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { Info, Pencil, Plus, SquareChevronDown, SquareChevronUp } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import DeletePopup from '$lib/DeletePopup.svelte';

	let { data }: PageProps = $props();

	// Sort councils by ID
	const councils = data.data.sort((a: any, b: any) => a.id - b.id);
</script>

<div class="p-8">
	<div class="flex justify-between pb-6">
		<h3 class="h3">Hội đồng thẩm định</h3>
		<a href="/management/councils/details/0/edit" class="btn preset-tonal-primary">
			<Plus />Tạo hội đồng mới
		</a>
	</div>

	<Accordion multiple collapsible>
		{#snippet iconOpen()}
			<SquareChevronUp />
		{/snippet}
		{#snippet iconClosed()}
			<SquareChevronDown />
		{/snippet}
		{#each councils as council, index}
			<Accordion.Item
				value={council.id}
				headingElement="span"
				controlClasses="font-bold"
				classes="border border-gray-400 rounded-sm"
			>
				{#snippet control()}
					<span class="flex justify-between items-center">
						<span class="flex items-center gap-2">
							<span class="badge-icon preset-outlined-surface-500">
								{index + 1}
							</span>
							{council.name}
						</span>
						<div class="flex gap-2">
							<span class="badge preset-outlined-surface-500">
								{council.memberCount} thành viên
							</span>
						</div>
					</span>
				{/snippet}
				{#snippet panel()}
					<div class="space-y-4">
						<div>
							<p>
								<strong>Chủ tịch:</strong>
								{council.chair?.fullName || 'Chưa có chủ tịch'}
							</p>
							<p>
								<strong>Ngày tạo:</strong>
								{new Date(council.createdAt).toLocaleDateString('vi-VN')}
							</p>
							{#if council.description}
								<p>
									<strong>Mô tả:</strong>
									{council.description}
								</p>
							{/if}
						</div>
						<div class="flex justify-end gap-2">
							<a href="/management/councils/details/{council.id}" class="btn preset-filled"
								><Info /> Chi tiết</a
							>
							<a
								href="/management/councils/details/{council.id}/edit"
								class="btn preset-filled-primary-500"><Pencil /> Chỉnh sửa</a
							>
							<DeletePopup id={council.id} />
						</div>
					</div>
				{/snippet}
			</Accordion.Item>
		{/each}
	</Accordion>
</div>
