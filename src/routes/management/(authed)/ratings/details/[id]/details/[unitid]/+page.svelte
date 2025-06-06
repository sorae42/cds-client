<script lang="ts">
	import { ArrowLeft, Building2, Users, Calendar, MapPin, FileText, Plus } from 'lucide-svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';
	import CRUDTable from '$lib/CRUDTable.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const period = data.period;
	const unit = data.availableUnits;

	// Modal state
	let openCriteriasModal = $state(false);

	// Transform users data for the table
	const usersTableData =
		unit.users?.map((user: any) => ({
			id: user.id,
			fullName: user.fullName,
			username: user.username
		})) || [];

	// Transform parent criterias data for the table (from period, not unit)
	const criteriasTableData =
		period.parentCriterias?.map((criteria: any) => {
			// Find target group name for this criteria
			const targetGroup = data.targetGroups?.find((tg: any) => tg.id === criteria.targetGroupId);
			const targetGroupName = targetGroup ? targetGroup.name : 'Chưa phân nhóm';
			
			return {
				id: criteria.id,
				name: criteria.name || 'Chưa có tên',
				maxScore: criteria.maxScore || 'Chưa xác định',
				targetGroupName: targetGroupName
			};
		}) || [];
</script>

<div class="p-8 space-y-8">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<div class="flex items-center gap-4">
			<a href="../" class="btn preset-outlined-surface-500">
				<ArrowLeft />
			</a>
			<h3 class="h3">Chi tiết đơn vị trong kỳ đánh giá</h3>
		</div>
	</div>

	<!-- Period Information -->
	<div class="card p-4 space-y-4">
		<div class="flex items-center gap-2 mb-4">
			<h4 class="h4">Thông tin kỳ đánh giá</h4>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<strong>Tên kỳ đánh giá:</strong>
				{period.name}
			</div>
			<div>
				<strong>Trạng thái:</strong>
				<span class="badge {period.isLocked ? 'preset-tonal-error' : 'preset-tonal-success'}">
					{period.isLocked ? 'Đã khóa' : 'Đang mở'}
				</span>
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

	<!-- Unit Information -->
	<div class="card p-4 space-y-4">
		<div class="flex items-center gap-2 mb-4">
			<h4 class="h4">Thông tin đơn vị</h4>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<strong>Tên đơn vị:</strong>
				{unit.name}
			</div>
			<div>
				<strong>Mã đơn vị:</strong>
				<span>{unit.code}</span>
			</div>
			<div>
				<strong>Loại đơn vị:</strong>
				{unit.type}
			</div>
			{#if unit.description}
				<div class="md:col-span-2">
					<strong>Mô tả:</strong>
					<p class="mt-1">{unit.description}</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Parent Criterias for Period -->
	<div class="card p-4">
		<div class="flex justify-between items-center gap-2 mb-4">
			<h4 class="h4">Tiêu chí đánh giá trong kỳ ({period.parentCriterias?.length || 0})</h4>
			<button class="btn preset-tonal-primary" onclick={() => (openCriteriasModal = true)}>
				<Plus /> Thêm nhóm tiêu chí
			</button>
		</div>
		{#if criteriasTableData.length > 0}
			<CRUDTable
				data={criteriasTableData}
				presentation={['Tên tiêu chí', 'Điểm tối đa']}
				dataBody={['name', 'maxScore']}
				presentationSub={['Nhóm tiêu chí']}
				dataSub={['targetGroupName']}
				updateButton={false}
				deleteButton={false}
			/>
		{:else}
			<div class="text-center py-8">
				<FileText class="w-12 h-12 text-surface-400 mx-auto mb-3" />
				<p class="text-surface-500">Chưa có tiêu chí đánh giá nào trong kỳ này</p>
			</div>
		{/if}
	</div>
</div>

<!-- Target Groups Modal -->
<Modal
	open={openCriteriasModal}
	onOpenChange={(e) => (openCriteriasModal = e.open)}
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form
			action="?/updatePeriodCriterias"
			method="POST"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						openCriteriasModal = false;
						window.location.reload();
					}
				};
			}}
		>
			<header class="flex justify-between items-center mb-6">
				<h3 class="h3">Chọn tiêu chí</h3>
			</header>

			<article class="space-y-6">
				{#if data.targetGroups && data.targetGroups.length > 0}
					{#each data.targetGroups as targetGroup}
						<fieldset class="border border-surface-300-600 rounded-lg p-4">
							<legend class="text-sm px-2">{targetGroup.name}</legend>

							{#if targetGroup.parentCriterias && targetGroup.parentCriterias.length > 0}
								<div class="space-y-2">
									{#each targetGroup.parentCriterias as criteria}
										{@const isSelected = period.parentCriterias?.some(
											(c: any) => c.id === criteria.id
										)}
										<label class="flex items-center gap-2 p-2 hover:bg-surface-hover rounded">
											<input
												type="checkbox"
												name="criteriaIds[]"
												value={criteria.id}
												checked={isSelected}
												class="form-checkbox"
											/>
											<div class="flex-1">
												<span class="text-sm font-medium"
													>{criteria.name}
													<span class="badge preset-outlined-surface-500 text-xs">
														{criteria.subCriterias?.length || 0} tiêu chí con
													</span>
												</span>
											</div>
										</label>
									{/each}
								</div>
							{:else}
								<p class="text-surface-500 text-sm">Không có tiêu chí cha nào trong nhóm này</p>
							{/if}
						</fieldset>
					{/each}
				{:else}
					<div class="text-center py-8">
						<FileText class="w-12 h-12 text-surface-400 mx-auto mb-3" />
						<p class="text-surface-500">Không có nhóm tiêu chí nào trong hệ thống</p>
					</div>
				{/if}
			</article>

			<footer class="flex justify-between gap-4 mt-6">
				<button type="button" class="btn preset-tonal" onclick={() => (openCriteriasModal = false)}>
					Hủy
				</button>
				<button type="submit" class="btn preset-filled-primary-500">
					<Plus class="w-4 h-4" />
					Cập nhật tiêu chí
				</button>
			</footer>
		</form>
	{/snippet}
</Modal>
