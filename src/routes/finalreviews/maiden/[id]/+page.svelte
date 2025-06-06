<script lang="ts">
	import { ArrowLeft, Crown, Users, FileText, MapPin, User, CheckCircle } from 'lucide-svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { currentUser, allReviewers } = data;

	// Calculate statistics
	const totalReviewers = allReviewers.length;
	const totalAssignments = allReviewers.reduce((sum: number, reviewer: any) => 
		sum + (reviewer.assignments?.length || 0), 0);
	const reviewersWithAssignments = allReviewers.filter((reviewer: any) => 
		reviewer.assignments && reviewer.assignments.length > 0).length;
</script>

<div class="p-8 space-y-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="/finalreviews" class="btn preset-outlined-surface-500">
			<ArrowLeft />
		</a>
		<div class="flex items-center gap-2">
			<Crown class="text-yellow-500" />
			<h3 class="h3">Quản lý hội đồng thẩm định</h3>
		</div>
	</div>

	<!-- Chairman Info -->
	<div class="card p-4">
		<h4 class="h4 mb-4 flex items-center gap-2">
			<Crown class="text-yellow-500" />
			Thông tin chủ tịch
		</h4>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<strong>Họ tên:</strong>
				{currentUser.fullName || 'Chưa cập nhật'}
			</div>
			<div>
				<strong>Tên đăng nhập:</strong>
				{currentUser.username}
			</div>
			<div>
				<strong>Vai trò:</strong>
				<span class="badge preset-outlined-warning-500">Chủ tịch hội đồng</span>
			</div>
		</div>
	</div>

	<!-- Statistics -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-primary-500">{totalReviewers}</p>
			<p class="text-sm text-surface-600-300">Tổng thành viên</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-success-500">{totalAssignments}</p>
			<p class="text-sm text-surface-600-300">Tổng nhiệm vụ</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-warning-500">{reviewersWithAssignments}</p>
			<p class="text-sm text-surface-600-300">Thành viên có nhiệm vụ</p>
		</div>
	</div>

	<!-- All Reviewers -->
	<div class="card p-4">
		<h4 class="h4 mb-4 flex items-center gap-2">
			<Users />
			Danh sách thành viên và nhiệm vụ
		</h4>

		<Accordion multiple collapsible>
			{#snippet iconOpen()}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
				</svg>
			{/snippet}
			{#snippet iconClosed()}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
				</svg>
			{/snippet}
			
			{#each allReviewers as reviewer, index}
				<Accordion.Item
					value={`reviewer-${reviewer.reviewerId}`}
					controlClasses="font-bold"
					classes="border border-gray-400 rounded-sm mb-2"
				>
					{#snippet control()}
						<span class="flex justify-between items-center w-full">
							<span class="flex items-center gap-2">
								{#if reviewer.isChair}
									<Crown size={20} class="text-yellow-500" />
								{:else}
									<User size={20} class="text-blue-500" />
								{/if}
								<span>{reviewer.fullName || reviewer.username}</span>
								{#if reviewer.isChair}
									<span class="badge preset-outlined-warning-500">Chủ tịch</span>
								{/if}
							</span>
							<div class="flex gap-2">
								<span class="badge preset-outlined-surface-500">
									{reviewer.assignments?.length || 0} nhiệm vụ
								</span>
								{#if reviewer.assignments && reviewer.assignments.length > 0}
									<CheckCircle size={16} class="text-success-500" />
								{/if}
							</div>
						</span>
					{/snippet}
					{#snippet panel()}
						<div class="p-4 space-y-4">
							<!-- Reviewer Info -->
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<strong>Tên đăng nhập:</strong>
									{reviewer.username}
								</div>
								<div>
									<strong>Họ tên:</strong>
									{reviewer.fullName || 'Chưa cập nhật'}
								</div>
							</div>

							<!-- Assignments -->
							{#if reviewer.assignments && reviewer.assignments.length > 0}
								<div>
									<h5 class="h5 mb-2">Nhiệm vụ được phân công:</h5>
									<div class="space-y-2">
										{#each reviewer.assignments as assignment, assignIndex}
											<div class="card p-3 bg-surface-50-950 border border-primary-200">
												<div class="flex justify-between items-start">
													<div class="flex items-center gap-2 mb-2">
														<span class="badge-icon preset-filled-primary-500 text-xs">
															{assignIndex + 1}
														</span>
														<span class="font-medium">Nhiệm vụ #{assignment.id}</span>
													</div>
												</div>
												<div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
													<div class="flex items-center gap-1">
														<MapPin size={14} class="text-primary-500" />
														<strong>Đơn vị:</strong>
														<span>{assignment.unitName}</span>
													</div>
													<div class="flex items-center gap-1">
														<FileText size={14} class="text-primary-500" />
														<strong>Tiêu chí:</strong>
														<span class="truncate">{assignment.subCriteriaName}</span>
													</div>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{:else}
								<div class="text-center py-4">
									<p class="text-surface-500">Chưa có nhiệm vụ nào được phân công</p>
								</div>
							{/if}
						</div>
					{/snippet}
				</Accordion.Item>
			{/each}
		</Accordion>
	</div>
</div>