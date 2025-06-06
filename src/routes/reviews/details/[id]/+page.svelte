<script lang="ts">
	import { ArrowLeft, FileText, Star, Clock, CheckCircle, Info } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const period = data.period;

	// Group sub-criterias by unit (only include those with assignments)
	const groupedByUnit =
		period.subCriterias?.reduce((acc: any, subCriteria: any) => {
			// Only include sub-criterias that have assignments
			if (subCriteria.assignment) {
				const unitName = subCriteria.assignment.unitName || 'Không xác định';
				if (!acc[unitName]) {
					acc[unitName] = [];
				}
				acc[unitName].push(subCriteria);
			}
			return acc;
		}, {}) || {};

	const unitNames = Object.keys(groupedByUnit);

	// Stats calculations (only count sub-criterias with assignments)
	const assignedSubCriterias =
		period.subCriterias?.filter((sc: any) => sc.assignment !== null) || [];
	const totalCriterias = assignedSubCriterias.length;
	const evaluatedCriterias = assignedSubCriterias.filter(
		(sc: any) => sc.assignment?.score !== null
	).length;
	const pendingCriterias = totalCriterias - evaluatedCriterias;
</script>

<div class="p-8 space-y-8">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<div class="flex items-center gap-4">
			<a href="/reviews" class="btn preset-outlined-surface-500">
				<ArrowLeft />
			</a>
			<h3 class="h3">{period.name}</h3>
		</div>
	</div>

	<!-- Period Information -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<strong>Thời gian bắt đầu:</strong>
			{new Date(period.startDate).toLocaleString('vi-VN')}
		</div>
		<div>
			<strong>Thời gian kết thúc:</strong>
			{new Date(period.endDate).toLocaleString('vi-VN')}
		</div>
	</div>

	<!-- Statistics -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-primary-500">{totalCriterias}</p>
			<p class="text-sm text-surface-600-300">Tiêu chí được gán</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-success-500">{evaluatedCriterias}</p>
			<p class="text-sm text-surface-600-300">Đã đánh giá</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-warning-500">{pendingCriterias}</p>
			<p class="text-sm text-surface-600-300">Chưa đánh giá</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-info-500">{unitNames.length}</p>
			<p class="text-sm text-surface-600-300">Đơn vị được gán</p>
		</div>
	</div>

	<!-- Sub-criterias by Unit -->
	{#each unitNames as unitName}
		<div class="card p-4">
			<div class="flex items-center gap-2 mb-4">
				<h4 class="h4">{unitName} ({groupedByUnit[unitName].length} tiêu chí)</h4>
			</div>

			<div class="space-y-3">
				{#each groupedByUnit[unitName] as subCriteria}
					<div class="border border-surface-300-600 rounded p-4 hover:bg-surface-hover">
						<!-- Content -->
						<div class="mb-3">
							<h5 class="font-semibold text-sm mb-1">{subCriteria.name}</h5>
							<p class="text-xs text-surface-500 mb-2">{subCriteria.description}</p>

							<div class="flex items-center gap-4 text-xs">
								<span class="badge preset-outlined-primary-500">
									Điểm tối đa: {subCriteria.maxScore || 'Chưa xác định'}
								</span>

								{#if subCriteria.assignment && subCriteria.assignment.score !== null}
									<span class="badge preset-tonal-success flex items-center gap-1">
										<CheckCircle class="w-3 h-3" />
										Đã chấm: {subCriteria.assignment.score} điểm
									</span>
								{:else}
									<span class="badge preset-tonal-warning flex items-center gap-1">
										<Clock class="w-3 h-3" />
										Chưa đánh giá
									</span>
								{/if}
							</div>
						</div>

						<div class="flex justify-between items-center">
							<div class="text-xs text-surface-400 mb-3">
								{#if subCriteria.assignment?.evaluatedAt}
									Đánh giá lúc: {new Date(subCriteria.assignment.evaluatedAt).toLocaleString(
										'vi-VN'
									)}
								{/if}
							</div>
							<a
								href="/reviews/details/{period.id}/rate?subCriteriaId={subCriteria.id}"
								class="btn {subCriteria.assignment.score !== null
									? 'preset-tonal-success'
									: 'preset-filled-primary-500'}"
							>
								<Star class="w-4 h-4" />
								{subCriteria.assignment.score !== null ? 'Xem lại' : 'Đánh giá'}
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}

	{#if totalCriterias === 0}
		<div class="text-center py-12">
			<FileText class="w-16 h-16 text-surface-400 mx-auto mb-4" />
			<h4 class="h4 text-surface-600-300 mb-2">Chưa có tiêu chí nào</h4>
			<p class="text-surface-500">Bạn chưa được phân công đánh giá tiêu chí nào trong kỳ này.</p>
		</div>
	{/if}
</div>
