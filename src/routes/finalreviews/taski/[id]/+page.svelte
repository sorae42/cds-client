<script lang="ts">
	import { ArrowLeft, FileText, Calendar, Building, CheckCircle } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="p-8 space-y-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="/finalreviews" class="btn preset-outlined-surface-500">
			<ArrowLeft />
		</a>
		<div>
			<h3 class="h3">Nhiệm vụ đánh giá của tôi</h3>
			<p class="text-surface-600-300">Hội đồng: {data.council.name}</p>
		</div>
	</div>

	<!-- User Info -->
	<div class="card p-4">
		<h4 class="h4 mb-4">Thông tin của tôi</h4>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<strong>Tên đầy đủ:</strong>
				{data.reviewerInfo?.fullName || 'Chưa cập nhật'}
			</div>
			<div>
				<strong>Tên đăng nhập:</strong>
				{data.reviewerInfo?.username || data.currentUser.username}
			</div>
			<div>
				<strong>Vai trò:</strong>
				<span class="badge preset-outlined-primary-500">Thành viên</span>
			</div>
		</div>
	</div>

	<!-- Assignments -->
	<div class="card p-4">
		<div class="flex justify-between items-center mb-4">
			<h4 class="h4">Nhiệm vụ được phân công ({data.userAssignments.length})</h4>
			<div class="badge preset-outlined-surface-500">
				{data.userAssignments.length} nhiệm vụ
			</div>
		</div>

		{#if data.userAssignments.length > 0}
			<div class="space-y-4">
				{#each data.userAssignments as assignment, index}
					<div class="card bg-surface-50-950 p-4">
						<div class="flex justify-between items-start mb-3">
							<div class="flex items-center gap-2">
								<span class="badge-icon preset-filled-primary-500">
									{index + 1}
								</span>
								<h5 class="h5">Nhiệm vụ #{assignment.id}</h5>
							</div>
							<span class="badge preset-outlined-warning-500">
								Chờ đánh giá
							</span>
						</div>

						<div class="space-y-3">
							<div class="flex items-start gap-3">
								<Building class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
								<div>
									<p class="font-medium">Đơn vị được đánh giá</p>
									<p class="text-surface-600-300">{assignment.unitName}</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<FileText class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
								<div>
									<p class="font-medium">Tiêu chí đánh giá</p>
									<p class="text-surface-600-300">{assignment.subCriteriaName}</p>
								</div>
							</div>
						</div>

						<div class="flex justify-end mt-4 gap-2">
							<button class="btn preset-filled-primary-500">
								<CheckCircle class="w-4 h-4" />
								Bắt đầu đánh giá
							</button>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<FileText class="w-16 h-16 text-surface-400 mx-auto mb-4" />
				<h4 class="h4 text-surface-600-300 mb-2">Chưa có nhiệm vụ nào</h4>
				<p class="text-surface-500">
					Bạn chưa được phân công nhiệm vụ đánh giá nào trong hội đồng này.
				</p>
			</div>
		{/if}
	</div>

	<!-- Statistics -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-primary-500">{data.userAssignments.length}</p>
			<p class="text-sm text-surface-600-300">Tổng nhiệm vụ</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-warning-500">{data.userAssignments.length}</p>
			<p class="text-sm text-surface-600-300">Chờ đánh giá</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-success-500">0</p>
			<p class="text-sm text-surface-600-300">Đã hoàn thành</p>
		</div>
	</div>
</div>