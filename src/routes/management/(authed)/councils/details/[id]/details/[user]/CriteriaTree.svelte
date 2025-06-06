<script lang="ts">
	import { Plus, SquareChevronUp, SquareChevronDown, X, Check } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { Accordion, Modal } from '@skeletonlabs/skeleton-svelte';

	const { units, reviewerId } = $props();

	let isOpen = $state(false);
	let assignForm: HTMLFormElement;
	let currentStep = $state(1);
	let selectedSubCriteria = $state<{ id: number; name: string } | null>(null);
	let selectedUnit = $state<{ id: number; name: string } | null>(null);

	const steps = [
		{ label: 'Đơn vị đánh giá', description: 'Chọn đơn vị đánh giá tiêu chí.' },
		{ label: 'Tiêu chí đánh giá', description: 'Chọn tiêu chí để phân công đánh giá.' },
		{ label: 'Xác nhận', description: 'Xem lại và xác nhận thông tin.' }
	];

	function isCurrentStep(index: number) {
		return currentStep === index + 1;
	}

	function onClose() {
		isOpen = false;
		currentStep = 1;
		selectedSubCriteria = null;
		selectedUnit = null;
	}

	function handleSelectCriteria(sub: any) {
		selectedSubCriteria = { id: sub.subCriteriaId, name: sub.subCriteriaName };
		currentStep = 3;
	}

	function handleSelectUnit(unit: any) {
		selectedUnit = { id: unit.id, name: unit.name };
		currentStep = 2;
	}

	function handleConfirm() {
		assignForm.requestSubmit();
	}

	function goBack() {
		if (currentStep > 1) {
			currentStep--;
		}
	}
</script>

<form
	bind:this={assignForm}
	action="?/assign"
	method="POST"
	class="hidden"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				window.location.reload();
			}
		};
	}}
>
	<input type="hidden" name="reviewerId" value={reviewerId} />
	<input type="hidden" name="unitId" value={selectedUnit?.id || ''} />
	<input type="hidden" name="subCriteriaId" value={selectedSubCriteria?.id || ''} />
</form>

<Modal
	open={isOpen}
	onOpenChange={(e) => (isOpen = e.open)}
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-7xl min-h-full overflow-y-auto"
	backdropClasses="backdrop-blur-sm"
	triggerClasses="btn preset-tonal-primary"
>
	{#snippet trigger()}
		<Plus />Thêm phân công
	{/snippet}
	{#snippet content()}
		<header class="flex justify-between items-center px-3 gap-6">
			<div class="flex items-center gap-4 w-3xl">
				{#each steps as step, i}
					<div class="flex items-center flex-1 last:flex-none">
						<div class="flex items-center gap-2">
							<button
								class="btn-icon rounded-full {isCurrentStep(i)
									? 'preset-filled-primary-500'
									: 'preset-filled-surface-200-800'}"
								onclick={() => (currentStep = i + 1)}
								disabled={(i === 1 && !selectedUnit) ||
									(i === 2 && (!selectedSubCriteria || !selectedUnit))}
							>
								<span class="font-bold">{i + 1}</span>
							</button>
							<span class="text-sm whitespace-nowrap font-bold">{step.label}</span>
						</div>
						{#if i < steps.length - 1}
							<hr class="flex-1 border-dashed !border-surface-200-800 mx-2" />
						{/if}
					</div>
				{/each}
			</div>
			<button type="button" class="btn preset-tonal h-full" onclick={onClose}><X /></button>
		</header>

		{#if selectedUnit && currentStep !== 3}
			<div class="m-3 p-3 bg-primary-100 rounded relative">
				<div
					class="absolute -top-2 left-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-primary-100"
				></div>
				Đơn vị: {selectedUnit.name}
			</div>
		{/if}

		<article class="space-y-4">
			{#if currentStep === 1}
				<div class="p-4">
					<table class="table">
						<thead>
							<tr>
								<th></th>
								<th>Mã đơn vị</th>
								<th>Tên đơn vị</th>
							</tr>
						</thead>
						<tbody>
							{#each units as unit}
								<tr>
									<td>
										<button
											type="button"
											class="btn btn-sm preset-filled"
											onclick={() => handleSelectUnit(unit)}
										>
											<Plus size={14} />
										</button>
									</td>
									<td class="text-sm">{unit.code}</td>
									<td class="text-sm">{unit.name}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else if currentStep === 2}
				{@const selectedUnitData = units.find((u: any) => u.id === selectedUnit?.id)}
				<div class="p-4">
					{#if selectedUnitData?.scoredAssignments && selectedUnitData.scoredAssignments.length > 0}
						<table class="table">
							<thead>
								<tr>
									<th>STT</th>
									<th>Tiêu chí con</th>
									<th>Điểm</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{#each selectedUnitData.scoredAssignments as scored, index}
									<tr>
										<td class="text-sm">{index + 1}</td>
										<td class="text-sm">{scored.subCriteriaName}</td>
										<td class="text-sm">
											<span class="badge preset-filled-success-500">
												{scored.score} điểm
											</span>
										</td>
										<td>
											<button
												type="button"
												class="btn btn-sm preset-filled-primary-500"
												onclick={() => handleSelectCriteria(scored)}
											>
												<Plus size={14} />
												Chọn
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{:else}
						<div class="text-center py-8">
							<p class="text-surface-500">Không có tiêu chí đã đánh giá nào cho đơn vị này</p>
						</div>
					{/if}
				</div>
			{:else if currentStep === 3}
				<div class="p-4 space-y-6">
					<h3 class="h3 text-center">Xác nhận thông tin phân công</h3>

					<div class="card bg-surface-50-950 p-4 space-y-4">
						<div class="flex justify-between items-center">
							<span class="font-semibold">Đơn vị được đánh giá:</span>
							<span class="text-primary-500">{selectedUnit?.name}</span>
						</div>

						<div class="flex justify-between items-center">
							<span class="font-semibold">Tiêu chí được phân công:</span>
							<span class="text-primary-500">{selectedSubCriteria?.name}</span>
						</div>
					</div>

					<div class="flex justify-between gap-4">
						<button type="button" class="btn preset-tonal" onclick={goBack}> Quay lại </button>

						<button type="button" class="btn preset-filled-primary-500" onclick={handleConfirm}>
							<Check size={16} />
							Xác nhận phân công
						</button>
					</div>
				</div>
			{/if}
		</article>
	{/snippet}
</Modal>
