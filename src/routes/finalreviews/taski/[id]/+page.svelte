<script lang="ts">
	import {
		ArrowLeft,
		FileText,
		Calendar,
		Building,
		CheckCircle,
		SquareChevronDown,
		SquareChevronUp,
		Star
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
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<strong>Tên đăng nhập:</strong>
				{data.currentUser.username}
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
			<Accordion multiple collapsible>
				{#snippet iconOpen()}
					<SquareChevronUp />
				{/snippet}
				{#snippet iconClosed()}
					<SquareChevronDown />
				{/snippet}
				{#each data.userAssignments as assignment, index}
					{@const hasResult = data.reviewResults.find((r: { subCriteriaName: any; unitName: any; }) => r.subCriteriaName === assignment.subCriteriaName && r.unitName === assignment.unitName)}
					<Accordion.Item
						value={`assignment-${assignment.id}`}
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
								{#if hasResult}
									<span class="badge preset-filled-success-500 flex items-center gap-1">
										<CheckCircle class="w-3 h-3" />
										Đã hoàn thành
									</span>
								{:else}
									<span class="badge preset-outlined-warning-500">Chờ đánh giá</span>
								{/if}
							</span>
						{/snippet}
						{#snippet panel()}
							<div class="p-4 space-y-4">
								<div class="flex items-center justify-between">
									<div class="flex items-start gap-3">
										<Building class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
										<p class="text-surface-600-300">{assignment.unitName}</p>
									</div>

									{#if hasResult}
										<div class="text-right">
											<p class="text-surface-600-300">Điểm: {hasResult.score}</p>
											{#if hasResult.comment}
												<p class="text-sm text-surface-600-300 mt-1">"{hasResult.comment}"</p>
											{/if}
										</div>
									{:else}
										<button
											class="btn preset-filled-primary-500"
											onclick={() => openReview(assignment)}
										>
											<CheckCircle class="w-4 h-4" />
											Thẩm định
										</button>
									{/if}
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
			<p class="text-2xl font-bold text-warning-500">{data.userAssignments.length - data.reviewResults.length}</p>
			<p class="text-sm text-surface-600-300">Chờ đánh giá</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-success-500">{data.reviewResults.length}</p>
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
									<span class="text-primary-500"
										>{selectedAssignment.subCriteriaDetails?.name ||
											selectedAssignment.subCriteriaName}</span
									>
								</div>
								{#if selectedAssignment.subCriteriaDetails?.description}
									<div>
										<strong>Mô tả:</strong>
										<p class="text-sm text-surface-600-300 mt-1">
											{selectedAssignment.subCriteriaDetails.description}
										</p>
									</div>
								{/if}
								{#if selectedAssignment.subCriteriaDetails?.evidenceInfo}
									<div>
										<strong>Tài liệu tham khảo:</strong>
										<p class="text-sm text-surface-600-300 mt-1">
											{selectedAssignment.subCriteriaDetails.evidenceInfo}
										</p>
									</div>
								{/if}
								<div class="grid grid-cols-2 gap-4">
									<div>
										<strong>Đơn vị:</strong>
										<span>{selectedAssignment.unitName}</span>
									</div>
									<div>
										<strong>Điểm tối đa:</strong>
										<span class="text-success-500 font-semibold"
											>{selectedAssignment.subCriteriaDetails?.maxScore || 10}</span
										>
									</div>
								</div>
							</div>
						</div>

						<!-- Score Input -->
						<div>
							<p class="label font-semibold mb-2">
								Điểm số: <strong class="text-primary-500">{reviewForm.score}</strong> / {selectedAssignment
									.subCriteriaDetails?.maxScore || 10}
							</p>
							<Slider
								value={sliderValue}
								onValueChange={(e) => {
									sliderValue = [e.value[0]];
								}}
								max={selectedAssignment.subCriteriaDetails?.maxScore || 10}
								min={0}
								step={1}
							/>
							<div class="flex justify-between text-sm text-surface-500 mt-2">
								<span>0</span>
								<span>{selectedAssignment.subCriteriaDetails?.maxScore || 10}</span>
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
						<input type="hidden" name="reviewAssignmentId" value={selectedAssignment.id} />
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
</div>
