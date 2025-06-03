<script lang="ts">
	import { Plus, X, SquareChevronUp, SquareChevronDown } from 'lucide-svelte';
	import CRUDTable from '$lib/CRUDTable.svelte';
	import { Modal, Accordion } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let period = data.period;
	let openManageModal = $state(false);

	// Transform data for tables
	const unitTableData =
		period.units?.map((unit: any) => ({
			id: unit.id,
			name: unit.name,
			code: unit.code,
			type: unit.type
		})) || [];

	const criteriaTableData =
		period.parentCriterias?.map((criteria: any) => ({
			id: criteria.id,
			name: criteria.name,
			maxScore: criteria.maxScore || 'Chưa có',
			targetGroupName:
				data.targetGroups?.find((g: any) =>
					g.parentCriterias?.some((pc: any) => pc.id === criteria.id)
				)?.name || 'Không xác định'
		})) || [];
</script>

<div class="p-8 space-y-8">
	<div class="flex justify-between items-center">
		<h3 class="h3">Chi tiết đánh giá</h3>
		<div class="flex gap-2">
			<a href="../" class="btn preset-tonal">Quay lại</a>
		</div>
	</div>

	<div class="card p-4 space-y-4">
		<h4 class="h4">Thông tin chung</h4>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<strong>Tên kỳ:</strong>
				{period.name}
			</div>
			<div>
				<strong>Trạng thái:</strong>
				{period.isLocked ? 'Đã khoá' : 'Đang mở'}
			</div>
			<div>
				<strong>Thời gian bắt đầu:</strong>
				{new Date(period.startDate).toLocaleString('vi-VN')}
			</div>
			<div>
				<strong>Thời gian kết thúc:</strong>
				{new Date(period.endDate).toLocaleString('vi-VN')}
			</div>
		</div>
	</div>

	<div class="card p-4">
		<div class="mb-4">
			<h4 class="h4">Tiêu chí đánh giá ({period.parentCriterias?.length || 0})</h4>
			<p>Bấm vào chi tiết để xem các tiêu chí và tiến hành đánh giá.</p>
		</div>
		<CRUDTable
			data={criteriaTableData}
			presentation={['Tên tiêu chí', 'Điểm tối đa', 'Nhóm']}
			dataBody={['name', 'maxScore', 'targetGroupName']}
			updateButton={false}
			deleteButton={false}
		/>
	</div>
</div>