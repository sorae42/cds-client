<script lang="ts">
	import { Star, ArrowLeft } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Transform sub-criterias data for display
	const tableData =
		data.subCriterias?.map((subCriteria: any) => ({
			id: subCriteria.id,
			name: subCriteria.name,
			maxScore: subCriteria.maxScore || 'Chưa xác định',
			description: subCriteria.description || '',
			evidenceInfo: subCriteria.evidenceInfo || ''
		})) || [];

	function handleRate(subCriteriaId: number, subCriteriaName: string) {
		// Navigate to rating page or open rating modal
		window.location.href = `/reviews/details/${data.evaluationId}/rate/${subCriteriaId}`;
	}
</script>

<div class="p-8 space-y-6">
	<!-- Header -->
	<div class="flex justify-between items-center gap-4 mb-6">
		<div class="flex items-center gap-6">
			<a href="../" class="btn preset-tonal">
				<ArrowLeft />
			</a>
            <h4>Đánh giá</h4>
		</div>
		<div class="text-right">
			<p class="text-surface-600-300">
				Tiêu chí: <strong>{data.parentCriteria.name}</strong>
			</p>
			<p class="text-sm text-surface-500">
				Nhóm: {data.parentCriteria.groupId.name}
			</p>
			<p class="text-sm text-surface-500">
				Kỳ đánh giá: {data.parentCriteria.evaluationPeriod.name}
			</p>
		</div>
	</div>

	<!-- Sub-Criterias Table -->
	<div class="card p-6">
		{#if tableData.length > 0}
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th class="table-cell-fit">STT</th>
							<th>Tên tiêu chí con</th>
							<th class="table-cell-fit">Điểm tối đa</th>
							<th class="table-cell-fit">Thao tác</th>
						</tr>
					</thead>
					<tbody>
						{#each tableData as item, index}
							<tr>
								<td class="table-cell-fit">
									<span class="badge-icon preset-outlined-surface-500">
										{index + 1}
									</span>
								</td>
								<td>
									<div>
										<p class="font-semibold">{item.name}</p>
									</div>
								</td>
								<td class="table-cell-fit">
									<span class="badge preset-filled-primary-500">
										{item.maxScore}
										{#if typeof item.maxScore === 'number'}điểm{/if}
									</span>
								</td>
								<td class="table-cell-fit">
									<button
										type="button"
										class="btn preset-filled-primary-500"
										onclick={() => handleRate(item.id, item.name)}
									>
										<Star class="w-4 h-4" />
										Đánh giá
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="text-center py-8">
				<Star class="w-12 h-12 text-surface-400 mx-auto mb-3" />
				<p class="text-surface-500">Không có tiêu chí con nào trong tiêu chí này</p>
			</div>
		{/if}
	</div>

	<!-- Summary Card -->
	<div class="card p-4">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="text-center">
				<p class="text-2xl font-bold text-primary-500">{tableData.length}</p>
				<p class="text-sm text-surface-600-300">Tổng số tiêu chí con</p>
			</div>
			<div class="text-center">
				<p class="text-2xl font-bold text-success-500">
					{data.parentCriteria.maxScore || 'Chưa xác định'}
				</p>
				<p class="text-sm text-surface-600-300">Điểm tối đa tiêu chí cha</p>
			</div>
			<div class="text-center">
				<p class="text-2xl font-bold text-warning-500">0</p>
				<p class="text-sm text-surface-600-300">Đã đánh giá</p>
			</div>
		</div>
	</div>
</div>
