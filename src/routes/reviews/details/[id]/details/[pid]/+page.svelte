<script lang="ts">
	import { Star, ArrowLeft, Save } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { Modal, Slider } from '@skeletonlabs/skeleton-svelte';
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

	// Form states for rating modal/form
	let isRatingModalOpen = $state(false);
	let selectedSubCriteria = $state<any>(null);
	let ratingForm = $state({
		score: [0], // Default to 0
		comment: '',
		evidenceInfo: '',
		assignmentId: '' // For editing existing assignments
	});

	function openRatingModal(subCriteria: any, existingAssignment?: any) {
		selectedSubCriteria = subCriteria;
		ratingForm = {
			score: [existingAssignment?.score || 0], // Default to 0 if no existing score
			comment: existingAssignment?.comment || '',
			evidenceInfo: existingAssignment?.evidenceInfo || '',
			assignmentId: existingAssignment?.id || ''
		};
		isRatingModalOpen = true;
	}

	function closeRatingModal() {
		isRatingModalOpen = false;
		selectedSubCriteria = null;
		ratingForm = { score: [0], comment: '', evidenceInfo: '', assignmentId: '' };
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
										onclick={() => openRatingModal(item)}
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

<!-- Rating Modal -->
<Modal
	open={isRatingModalOpen}
	onOpenChange={(e) => !e.open && closeRatingModal()}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-6 space-y-4 shadow-xl w-full max-w-2xl"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		{#if selectedSubCriteria}
			<form
				action="?/submitAssignment"
				method="POST"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							closeRatingModal();
							window.location.reload();
						}
					};
				}}
			>
				<input type="hidden" name="subCriteriaId" value={selectedSubCriteria.id} />
				<input type="hidden" name="score" value={ratingForm.score[0]} />
				{#if ratingForm.assignmentId}
					<input type="hidden" name="assignmentId" value={ratingForm.assignmentId} />
				{/if}

				<article class="[&>div]:py-2">
					<div>
						<h4 class="font-semibold">{selectedSubCriteria.name}</h4>
						<br />
						<p class="text-sm text-surface-600-300">
							Điểm tối đa: {selectedSubCriteria.maxScore}
						</p>
					</div>

					<div>
						<p>Điểm số: <strong>{ratingForm.score[0]}</strong> / 10</p>
						<br />
						<Slider
							value={ratingForm.score}
							onValueChange={(e) => (ratingForm.score = e.value)}
							markers={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
							min={0}
							max={10}
							step={1}
						/>
					</div>

					<div>
						<label class="label" for="comment">
							<span>Nhận xét</span>
						</label>
						<textarea
							id="comment"
							name="comment"
							class="textarea"
							rows="3"
							bind:value={ratingForm.comment}
							placeholder="Nhập nhận xét về tiêu chí này..."
						></textarea>
					</div>

					<div>
						<label class="label" for="evidenceInfo">
							<span>Thông tin minh chứng</span>
						</label>
						<textarea
							id="evidenceInfo"
							name="evidenceInfo"
							class="textarea"
							rows="3"
							bind:value={ratingForm.evidenceInfo}
							placeholder="Nhập thông tin minh chứng..."
						></textarea>
					</div>
				</article>

				<footer class="flex justify-between gap-4 mt-6">
					<button type="button" class="btn preset-tonal" onclick={closeRatingModal}> Hủy </button>
					<button type="submit" class="btn preset-filled-primary-500">
						<Save class="w-4 h-4" />
						{ratingForm.assignmentId ? 'Cập nhật' : 'Gửi đánh giá'}
					</button>
				</footer>
			</form>
		{/if}
	{/snippet}
</Modal>
