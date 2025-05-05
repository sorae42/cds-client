<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import CRUDTable from '$lib/CRUDTable.svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let period = data.period;
	let openAddUnits = $state(false);
	let openAddCriterias = $state(false);

	// Transform data for units table
	const unitTableData = period.units.map((unit: any) => ({
		id: unit.id,
		name: unit.name,
		code: unit.code,
		type: unit.type
	}));

	// Transform data for criterias table
	const criteriaTableData = period.parentCriterias.map((criteria: any) => ({
		id: criteria.id,
		name: criteria.name,
		maxScore: criteria.maxScore || 'Chưa có',
		targetGroupId: criteria.targetGroupId
	}));

	// Filter out already added units/criterias
	$effect(() => {
		data.availableUnits = data.availableUnits.filter(
			(unit: { id: any }) => !period.units.find((u: { id: any }) => u.id === unit.id)
		);
		data.availableCriterias = data.availableCriterias.filter(
			(criteria: { id: any }) =>
				!period.parentCriterias.find((c: { id: any }) => c.id === criteria.id)
		);
	});
</script>

<div class="p-8 space-y-8">
	<div class="flex justify-between items-center">
		<h3 class="h3">Chi tiết kỳ đánh giá</h3>
		<a href="/management/ratings" class="btn preset-tonal">Quay lại</a>
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
		<div class="flex justify-between items-center mb-4">
			<h4 class="h4">Đơn vị tham gia</h4>
			<button class="btn preset-tonal-primary" onclick={() => (openAddUnits = true)}>
				<Plus />Thêm đơn vị
			</button>
		</div>
		<CRUDTable
			data={unitTableData}
			presentation={['Tên đơn vị', 'Mã', 'Loại']}
			dataBody={['name', 'code', 'type']}
			detailButton={false}
			updateButton={false}
			deleteButton={true}
		/>
	</div>

	<div class="card p-4">
		<div class="flex justify-between items-center mb-4">
			<h4 class="h4">Tiêu chí đánh giá</h4>
			<button class="btn preset-tonal-primary" onclick={() => (openAddCriterias = true)}>
				<Plus />Thêm tiêu chí
			</button>
		</div>
		<CRUDTable
			data={criteriaTableData}
			presentation={['Tên tiêu chí', 'Điểm tối đa', 'Nhóm']}
			dataBody={['name', 'maxScore', 'targetGroupId']}
			detailButton={false}
			updateButton={false}
			deleteButton={true}
		/>
	</div>
</div>

<!-- Add Units Modal -->
<Modal
	open={openAddUnits}
	onOpenChange={(e) => (openAddUnits = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form action="?/updateUnits" method="POST">
			<article class="space-y-4">
				<h3 class="h3">Thêm đơn vị</h3>
				{#each data.availableUnits as unit}
					<label class="flex items-center gap-2">
						<input type="checkbox" name="unitIds[]" value={unit.id} />
						{unit.name} ({unit.code})
					</label>
				{/each}
				<input
					type="hidden"
					name="existingIds"
					value={JSON.stringify(period.units.map((u: { id: any }) => u.id))}
				/>
			</article>
			<footer class="flex justify-between mt-4">
				<button type="button" class="btn preset-tonal" onclick={() => (openAddUnits = false)}>
					Huỷ
				</button>
				<button type="submit" class="btn preset-filled">
					<Plus />Thêm
				</button>
			</footer>
		</form>
	{/snippet}
</Modal>

<!-- Add Criterias Modal -->
<Modal
	open={openAddCriterias}
	onOpenChange={(e) => (openAddCriterias = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form action="?/updateCriterias" method="POST">
			<article class="space-y-4">
				<h3 class="h3">Thêm tiêu chí</h3>
				{#each data.availableCriterias as criteria}
					<label class="flex items-center gap-2">
						<input type="checkbox" name="criteriaIds[]" value={criteria.id} />
						{criteria.name}
					</label>
				{/each}
				<input
					type="hidden"
					name="existingIds"
					value={JSON.stringify(period.parentCriterias.map((c: { id: any }) => c.id))}
				/>
			</article>
			<footer class="flex justify-between mt-4">
				<button type="button" class="btn preset-tonal" onclick={() => (openAddCriterias = false)}>
					Huỷ
				</button>
				<button type="submit" class="btn preset-filled">
					<Plus />Thêm
				</button>
			</footer>
		</form>
	{/snippet}
</Modal>
