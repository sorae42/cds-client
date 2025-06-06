<script lang="ts">
	import {
		ArrowLeft,
		FileText,
		Calendar,
		Building,
		CheckCircle,
		SquareChevronDown,
		SquareChevronUp,
		Star,
		Plus,
		X,
		Check
	} from 'lucide-svelte';
	import { Accordion, Modal, Slider } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';
	import { toaster } from '$lib/toaster';
	import { invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Modal state
	let openReviewModal = $state(false);
	let selectedAssignment = $state<any>(null);

	// Adding subcriteria modal state
	let openAddCriteriaModal = $state(false);
	let assignForm: HTMLFormElement;
	let fetchForm: HTMLFormElement;
	let currentStep = $state(1);
	let selectedSubCriteria = $state<{ id: number; name: string } | null>(null);
	let selectedUnit = $state<{ id: number; name: string } | null>(null);
	let unitSubCriterias = $state<any[]>([]);
	let isLoadingSubCriterias = $state(false);

	const steps = [
		{ label: 'Đơn vị đánh giá', description: 'Chọn đơn vị đánh giá tiêu chí.' },
		{ label: 'Tiêu chí đánh giá', description: 'Chọn tiêu chí để phân công đánh giá.' },
		{ label: 'Xác nhận', description: 'Xem lại và xác nhận thông tin.' }
	];

	// Form state
	let reviewForm = $state({
		score: 0,
		comment: ''
	});

	// Slider value (needs to be number for our form, but array for Slider component)
	let sliderValue = $state([0]);

	function openReview(assignment: any) {
		selectedAssignment = assignment;

		// Start at 0 instead of maxScore
		reviewForm.score = 0;
		reviewForm.comment = '';
		sliderValue = [0];

		openReviewModal = true;
	}

	function closeModal() {
		openReviewModal = false;
		selectedAssignment = null;
		reviewForm = { score: 0, comment: '' };
		sliderValue = [0];
	}

	// Adding subcriteria functions
	function isCurrentStep(index: number) {
		return currentStep === index + 1;
	}

	function onCloseAddCriteria() {
		openAddCriteriaModal = false;
		currentStep = 1;
		selectedSubCriteria = null;
		selectedUnit = null;
		unitSubCriterias = [];
	}

	function handleSelectCriteria(sub: any) {
		selectedSubCriteria = { id: sub.id, name: sub.name };
		currentStep = 3;
	}

	function handleSelectUnit(unit: any) {
		selectedUnit = { id: unit.id, name: unit.name };
		isLoadingSubCriterias = true;
		
		// Set the unit ID in the form and submit
		const unitIdInput = fetchForm.querySelector('[name="unitId"]') as HTMLInputElement;
		if (unitIdInput) {
			unitIdInput.value = unit.id.toString();
			fetchForm.requestSubmit();
		}
	}

	function handleConfirm() {
		assignForm.requestSubmit();
	}

	function goBack() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	// Update score when slider changes
	$effect(() => {
		if (sliderValue.length > 0) {
			reviewForm.score = sliderValue[0];
		}
	});
</script>

<div class="p-8 space-y-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="../" class="btn preset-outlined-surface-500">
			<ArrowLeft />
		</a>
		<div>
			<h3 class="h3">Chi tiết thành viên hội đồng</h3>
			<p class="text-surface-600-300">Hội đồng: {data.council.name}</p>
		</div>
	</div>

	<!-- User Info -->
	<div class="card p-4">
		<h4 class="h4 mb-4">Thông tin thành viên</h4>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<strong>Vai trò:</strong>
				{#if data.reviewer.isChair}
					<span class="badge preset-outlined-warning-500">Chủ tịch</span>
				{:else}
					<span class="badge preset-outlined-primary-500">Thành viên</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Assignments -->
	<div class="card p-4">
		<div class="flex justify-between items-center mb-4">
			<h4 class="h4">Nhiệm vụ được phân công ({data.reviewer.assignments?.length || 0})</h4>
			<div class="flex gap-2">
				<button 
					class="btn preset-tonal-primary" 
					onclick={() => (openAddCriteriaModal = true)}
				>
					<Plus />Thêm phân công
				</button>
				<div class="badge preset-outlined-surface-500">
					{data.reviewer.assignments?.length || 0} nhiệm vụ
				</div>
			</div>
		</div>

		{#if data.reviewer.assignments && data.reviewer.assignments.length > 0}
			<Accordion multiple collapsible>
				{#snippet iconOpen()}
					<SquareChevronUp />
				{/snippet}
				{#snippet iconClosed()}
					<SquareChevronDown />
				{/snippet}
				{#each data.reviewer.assignments as assignment, index}
					<Accordion.Item
						value={`assignment-${assignment.reviewAssignmentId}`}
						controlClasses="font-medium"
						classes="border border-surface-300-600 rounded-lg mb-2"
					>
						{#snippet control()}
							<span class="flex justify-between items-center w-full">
								<span class="flex items-center gap-2">
									<span class="badge-icon preset-filled-primary-500">
										{index + 1}
									</span>
									<span>{assignment.subCriteriaName}</span>
								</span>
								<span class="badge preset-outlined-warning-500">Chờ đánh giá</span>
							</span>
						{/snippet}
						{#snippet panel()}
							<div class="p-4 space-y-4">
								<div class="flex items-center justify-between">
									<div class="flex items-start gap-3">
										<Building class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
										<p class="text-surface-600-300">{assignment.unitName}</p>
									</div>

									<button
										class="btn preset-filled-primary-500"
										onclick={() => openReview(assignment)}
									>
										<CheckCircle class="w-4 h-4" />
										Thẩm định
									</button>
								</div>
							</div>
						{/snippet}
					</Accordion.Item>
				{/each}
			</Accordion>
		{:else}
			<div class="text-center py-12">
				<FileText class="w-16 h-16 text-surface-400 mx-auto mb-4" />
				<h4 class="h4 text-surface-600-300 mb-2">Chưa có nhiệm vụ nào</h4>
				<p class="text-surface-500">
					Thành viên này chưa được phân công nhiệm vụ đánh giá nào trong hội đồng này.
				</p>
			</div>
		{/if}
	</div>

	<!-- Statistics -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-primary-500">{data.reviewer.assignments?.length || 0}</p>
			<p class="text-sm text-surface-600-300">Tổng nhiệm vụ</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-warning-500">{data.reviewer.assignments?.length || 0}</p>
			<p class="text-sm text-surface-600-300">Chờ đánh giá</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-success-500">0</p>
			<p class="text-sm text-surface-600-300">Đã hoàn thành</p>
		</div>
	</div>

	<!-- Review Modal -->
	<Modal
		open={openReviewModal}
		onOpenChange={(e) => (openReviewModal = e.open)}
		contentBase="card bg-surface-100-900 p-6 space-y-4 shadow-xl max-w-3xl"
		backdropClasses="backdrop-blur-sm"
	>
		{#snippet content()}
			{#if selectedAssignment}
				<form
					action="?/submitReview"
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'failure') {
								toaster.error({
									title: result.data?.error || 'Có lỗi xảy ra khi gửi đánh giá'
								});
								return;
							}
							if (result.type === 'success') {
								toaster.success({
									title: 'Gửi đánh giá thành công!'
								});
								closeModal();
								await invalidateAll();
							}
						};
					}}
				>
					<article class="space-y-6">
						<!-- Assignment Info -->
						<div class="card bg-surface-50-950 p-4">
							<div class="space-y-3">
								<div>
									<strong>Tiêu chí:</strong>
									<span class="text-primary-500">{selectedAssignment.subCriteriaName}</span>
								</div>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<strong>Đơn vị:</strong>
										<span>{selectedAssignment.unitName}</span>
									</div>
									<div>
										<strong>Điểm tối đa:</strong>
										<span class="text-success-500 font-semibold">10</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Score Input -->
						<div>
							<p class="label font-semibold mb-2">
								Điểm số: <strong class="text-primary-500">{reviewForm.score}</strong> / 10
							</p>
							<Slider
								value={sliderValue}
								onValueChange={(e) => {
									sliderValue = [e.value[0]];
								}}
								max={10}
								min={0}
								step={1}
							/>
							<div class="flex justify-between text-sm text-surface-500 mt-2">
								<span>0</span>
								<span>10</span>
							</div>
						</div>

						<!-- Comment -->
						<div>
							<label class="label font-semibold" for="review-comment"> Nhận xét: </label>
							<textarea
								id="review-comment"
								name="comment"
								class="textarea mt-2"
								rows="4"
								bind:value={reviewForm.comment}
								placeholder="Nhập nhận xét đánh giá của bạn..."
							></textarea>
						</div>

						<!-- Hidden inputs -->
						<input type="hidden" name="reviewAssignmentId" value={selectedAssignment.reviewAssignmentId} />
						<input type="hidden" name="score" value={reviewForm.score} />
					</article>

					<footer class="flex justify-end gap-4 mt-6">
						<button type="button" class="btn preset-tonal" onclick={closeModal}> Hủy </button>
						<button type="submit" class="btn preset-filled-primary-500">
							<CheckCircle class="w-4 h-4" />
							Gửi đánh giá
						</button>
					</footer>
				</form>
			{/if}
		{/snippet}
	</Modal>

	<!-- Adding Subcriteria Modal -->
	<Modal
		open={openAddCriteriaModal}
		onOpenChange={(e) => (openAddCriteriaModal = e.open)}
		contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-7xl min-h-full overflow-y-auto"
		backdropClasses="backdrop-blur-sm"
	>
		{#snippet content()}
			<!-- Hidden Forms for Assignment -->
			<form
				bind:this={assignForm}
				action="?/assign"
				method="POST"
				class="hidden"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							toaster.success({
								title: 'Phân công thành công!'
							});
							onCloseAddCriteria();
							await invalidateAll();
						} else if (result.type === 'failure') {
							toaster.error({
								title: result.data?.error || 'Phân công thất bại'
							});
						}
					};
				}}
			>
				<input type="hidden" name="reviewerId" value={data.reviewer.reviewerId} />
				<input type="hidden" name="unitId" value={selectedUnit?.id || ''} />
				<input type="hidden" name="subCriteriaId" value={selectedSubCriteria?.id || ''} />
			</form>

			<form
				bind:this={fetchForm}
				action="?/fetchSubCriterias"
				method="POST"
				class="hidden"
				use:enhance={() => {
					return async ({ result }) => {
						isLoadingSubCriterias = false;
						if (result.type === 'success') {
							unitSubCriterias = Array.isArray(result.data) ? result.data : [];
							currentStep = 2;
						} else {
							unitSubCriterias = [];
						}
					};
				}}
			>
				<input type="hidden" name="unitId" value="" />
			</form>

			<!-- Modal Header -->
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
				<button type="button" class="btn preset-tonal h-full" onclick={onCloseAddCriteria}><X /></button>
			</header>

			{#if selectedUnit && currentStep !== 3}
				<div class="m-3 p-3 bg-primary-100 rounded relative">
					<div
						class="absolute -top-2 left-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-primary-100"
					></div>
					Đơn vị: {selectedUnit.name}
				</div>
			{/if}

			<!-- Modal Content -->
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
								{#if data.units && data.units.length > 0}
									{#each data.units as unit}
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
								{:else}
									<tr>
										<td colspan="3" class="text-center py-4">
											<p class="text-surface-500">Không có đơn vị nào</p>
										</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				{:else if currentStep === 2}
					<div class="p-4">					
						{#if isLoadingSubCriterias}
							<div class="text-center py-8">
								<p class="text-surface-500">Đang tải danh sách tiêu chí...</p>
							</div>
						{:else if unitSubCriterias.length > 0}
							<Accordion multiple collapsible>
								{#snippet iconOpen()}
									<SquareChevronUp />
								{/snippet}
								{#snippet iconClosed()}
									<SquareChevronDown />
								{/snippet}
								{#each unitSubCriterias as subCriteria, index}
									<Accordion.Item
										value={subCriteria.id}
										controlClasses="font-bold"
										classes="border border-gray-400 rounded-sm mb-2"
									>
										{#snippet control()}
											<span class="flex justify-between items-center w-full">
												<span class="flex items-center gap-2">
													<span class="badge-icon preset-outlined-surface-500">
														{index + 1}
													</span>
													<span class="text-sm">{subCriteria.name}</span>
												</span>
												<span class="badge preset-outlined-surface-500">
													{subCriteria.maxScore} điểm
												</span>
											</span>
										{/snippet}
										{#snippet panel()}
											<div class="p-4">
												<div class="mb-4">
													<h6 class="font-medium text-sm text-surface-600-300 mb-1">Mô tả:</h6>
													<p class="text-sm">{subCriteria.description || 'Chưa có mô tả'}</p>
												</div>
												<div class="flex justify-end">
													<button
														type="button"
														class="btn btn-sm preset-filled-primary-500"
														onclick={() => handleSelectCriteria(subCriteria)}
													>
														<Plus size={14} />
														Chọn tiêu chí này
													</button>
												</div>
											</div>
										{/snippet}
									</Accordion.Item>
								{/each}
							</Accordion>
						{:else}
							<div class="text-center py-8">
								<p class="text-surface-500">Không có tiêu chí nào cho đơn vị này</p>
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
</div>