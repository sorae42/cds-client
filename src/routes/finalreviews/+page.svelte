<script lang="ts">
	import {
		SquareChevronDown,
		SquareChevronUp,
		Eye,
		Crown,
		Users,

		Cog,

		Clipboard


	} from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	let { data }: PageProps = $props();
	let chairCouncils: Array<any> = $state(data.chairCouncils || []);
	let memberCouncils: Array<any> = $state(data.memberCouncils || []);
</script>

<div class="p-8 flex justify-between">
	<h3 class="h3">Hội đồng thẩm định của tôi</h3>
</div>

{#if chairCouncils.length === 0 && memberCouncils.length === 0}
	<div class="p-8 pt-0">
		<div class="card p-8 text-center space-y-4">
			<div class="text-6xl opacity-50">👥</div>
			<h4 class="h4">Không có hội đồng nào</h4>
			<p class="text-surface-500">
				Bạn chưa tham gia vào bất kỳ hội đồng thẩm định nào.
			</p>
			<p class="text-sm text-surface-400">
				Vui lòng liên hệ với quản trị viên để được thêm vào hội đồng thẩm định.
			</p>
		</div>
	</div>
{:else}
	<div class="p-8 pt-0 space-y-8">
		<!-- Chairman Section -->
		{#if chairCouncils.length > 0}
			<div>
				<h4 class="h4 mb-4 flex items-center gap-2">
					<Crown class="text-yellow-500" />
					Chủ tịch hội đồng ({chairCouncils.length})
				</h4>
				<Accordion multiple collapsible>
					{#snippet iconOpen()}
						<SquareChevronUp />
					{/snippet}
					{#snippet iconClosed()}
						<SquareChevronDown />
					{/snippet}
					{#each chairCouncils as council}
						<Accordion.Item
							value={`chair-${council.id}`}
							controlClasses="font-bold"
							classes="border border-yellow-400 rounded-sm"
						>
							{#snippet control()}
								<span class="flex justify-between items-center">
									<span class="flex items-center gap-2">
										{council.name}
									</span>
									<div class="flex gap-2">
										<span class="badge preset-outlined-surface-500">
											{council.memberCount} thành viên
										</span>
										<span class="badge preset-outlined-warning-500">
											Chủ tịch
										</span>
										<span class="badge preset-outlined-primary-500">
											{new Date(council.createdAt).toLocaleDateString('vi-VN')}
										</span>
									</div>
								</span>
							{/snippet}
							{#snippet panel()}
								<div class="space-y-4">
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<strong>Chủ tịch hội đồng:</strong>
											{council.chair?.fullName || 'Chưa có'}
										</div>
										<div>
											<strong>Ngày tạo:</strong>
											{new Date(council.createdAt).toLocaleDateString('vi-VN')}
										</div>
										{#if council.description}
											<div class="col-span-2">
												<strong>Mô tả:</strong>
												{council.description}
											</div>
										{/if}
									</div>
									<div class="flex justify-end gap-2">
										<a class="btn preset-filled" href="/finalreviews/maiden/{council.id}"
											><Cog />Quản lý hội đồng</a
										>
									</div>
								</div>
							{/snippet}
						</Accordion.Item>
					{/each}
				</Accordion>
			</div>
		{/if}

		<!-- Member Section -->
		{#if memberCouncils.length > 0}
			<div>
				<h4 class="h4 mb-4 flex items-center gap-2">
					<Users class="text-blue-500" />
					Thành viên hội đồng ({memberCouncils.length})
				</h4>
				<Accordion multiple collapsible>
					{#snippet iconOpen()}
						<SquareChevronUp />
					{/snippet}
					{#snippet iconClosed()}
						<SquareChevronDown />
					{/snippet}
					{#each memberCouncils as council}
						<Accordion.Item
							value={`member-${council.id}`}
							controlClasses="font-bold"
							classes="border border-blue-400 rounded-sm"
						>
							{#snippet control()}
								<span class="flex justify-between items-center">
									<span class="flex items-center gap-2">
										{council.name}
									</span>
									<div class="flex gap-2">
										<span class="badge preset-outlined-surface-500">
											{council.memberCount} thành viên
										</span>
										<span class="badge preset-outlined-surface-500">
											Thành viên
										</span>
										<span class="badge preset-outlined-primary-500">
											{new Date(council.createdAt).toLocaleDateString('vi-VN')}
										</span>
									</div>
								</span>
							{/snippet}
							{#snippet panel()}
								<div class="space-y-4">
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<strong>Chủ tịch hội đồng:</strong>
											{council.chair?.fullName || 'Chưa có'}
										</div>
										<div>
											<strong>Ngày tạo:</strong>
											{new Date(council.createdAt).toLocaleDateString('vi-VN')}
										</div>
										{#if council.description}
											<div class="col-span-2">
												<strong>Mô tả:</strong>
												{council.description}
											</div>
										{/if}
									</div>
									<div class="flex justify-end gap-2">
										<a class="btn preset-filled" href="/finalreviews/taski/{council.id}"
											><Clipboard />Thẩm định tiêu chí</a
										>
									</div>
								</div>
							{/snippet}
						</Accordion.Item>
					{/each}
				</Accordion>
			</div>
		{/if}
	</div>
{/if}
