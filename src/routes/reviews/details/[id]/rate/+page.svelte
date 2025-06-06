<script lang="ts">
	import { ArrowLeft, Save, Info, Upload } from 'lucide-svelte';
	import { Slider } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';
	import { toaster } from '$lib/toaster';
	import { invalidateAll, goto } from '$app/navigation';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const period = data.period;
	const subCriteria = data.subCriteria;
	const assignment = subCriteria?.assignment;

	// Form state
	let evaluationForm = $state({
		score: assignment?.score || 0,
		comment: assignment?.comment || ''
	});

	// Derived state for slider (needs to be an array)
	let sliderValue = $state([evaluationForm.score]);

	const maxScore = subCriteria?.maxScore || 10;

	// File upload handling
	let selectedFile: File | null = $state(null);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			addFile(input.files[0]);
		}
	}

	function addFile(file: File) {
		// Check file size (10MB limit)
		if (file.size > 10 * 1024 * 1024) {
			toaster.error({ title: `Tệp "${file.name}" vượt quá giới hạn 10MB` });
			return;
		}
		
		// Check file type
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'image/jpeg',
			'image/jpg',
			'image/png',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		];
		
		if (!allowedTypes.includes(file.type)) {
			toaster.error({ title: `Loại tệp "${file.name}" không được hỗ trợ` });
			return;
		}

		selectedFile = file;
		updateFilePreview();
	}

	function removeFile() {
		selectedFile = null;
		updateFilePreview();
		// Clear the input value
		const input = document.getElementById('evidence-files') as HTMLInputElement;
		if (input) input.value = '';
	}

	function updateFilePreview() {
		const preview = document.getElementById('file-preview');
		const fileList = document.getElementById('file-list');
		
		if (!preview || !fileList) return;

		if (selectedFile) {
			preview.classList.remove('hidden');
			fileList.innerHTML = `
				<div class="flex items-center justify-between p-2 bg-surface-100-900 rounded border">
					<div class="flex items-center gap-2">
						<div class="w-8 h-8 bg-primary-100 text-primary-600 rounded flex items-center justify-center text-xs font-medium">
							${selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'}
						</div>
						<div>
							<p class="text-sm font-medium">${selectedFile.name}</p>
							<p class="text-xs text-surface-500">${(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
						</div>
					</div>
					<button type="button" onclick="removeFile()" class="text-error-500 hover:text-error-600 text-xs">
						Xóa
					</button>
				</div>
			`;
		} else {
			preview.classList.add('hidden');
		}
	}

	// Make removeFile available globally
	if (typeof window !== 'undefined') {
		(window as any).removeFile = removeFile;
	}
</script>

<div class="p-8 space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a class="btn preset-outlined-surface-500" href="/reviews/details/{period.id}">
			<ArrowLeft />
		</a>
		<div>
			<h3 class="h3">Đánh giá tiêu chí</h3>
			<p class="text-sm text-surface-600-300">
				{period.name}
			</p>
		</div>
	</div>

	{#if subCriteria}
		<form
			action="?/submitEvaluation"
			method="POST"
			enctype="multipart/form-data"
			use:enhance={() => {
				console.log('Submitting evaluation form');

				return async ({ result }) => {
					if (result.type === 'failure') {
						toaster.error({
							title: result.data?.error || 'Đánh giá thất bại'
						});
						return;
					}
					if (result.type === 'success') {
						toaster.success({
							title: result.data?.message || 'Đánh giá thành công!'
						});
						await invalidateAll();
						await goto(`/reviews/details/${period.id}`);
					}
				};
			}}
		>
			<input type="hidden" name="subCriteriaId" value={subCriteria.id} />
			<input type="hidden" name="score" value={evaluationForm.score} />
			{#if assignment?.id}
				<input type="hidden" name="assignmentId" value={assignment.id} />
			{/if}

			<!-- Sub-criteria Information -->
			<div class="space-y-4">
				<div>
					<h5 class="font-semibold mb-2">{subCriteria.name}</h5>
					{#if subCriteria.description}
						<p class="text-sm text-surface-600-300 mb-3">{subCriteria.description}</p>
					{/if}
					<div class="flex gap-2">
						<span class="badge preset-outlined-primary-500">
							Điểm tối đa: {subCriteria.maxScore}
						</span>
						<span class="badge preset-outlined-surface-500">
							Đơn vị: {assignment?.unitName}
						</span>
					</div>
				</div>

				{#if subCriteria.evidenceInfo}
					<div class="card bg-surface-50-950 p-4">
						<h6 class="font-semibold mb-2 flex items-center gap-2">
							<Info class="w-4 h-4" />
							Thông tin minh chứng:
						</h6>
						<p class="text-sm whitespace-pre-line">{subCriteria.evidenceInfo}</p>
					</div>
				{/if}
			</div>

			<!-- Current Status -->
			<div>
				<h4 class="h4 mb-4">Trạng thái</h4>
				<div class="flex justify-between">
					<div>
						<span>Trạng thái:</span>
						<span
							class="badge {assignment?.score !== null
								? 'preset-tonal-success'
								: 'preset-tonal-warning'}"
						>
							{assignment?.score !== null ? 'Đã đánh giá' : 'Chưa đánh giá'}
						</span>
					</div>
					{#if assignment?.evaluatedAt}
						<div class="flex gap-2">
							<span>Thời gian đánh giá:</span>
							<span class="text-sm">{new Date(assignment.evaluatedAt).toLocaleString('vi-VN')}</span
							>
						</div>
					{/if}
				</div>
			</div>

			<!-- Evaluation Form -->
			<div class="py-6">
				<div class="space-y-6">
					<!-- Score Input -->
					<div>
						<p class="font-semibold pb-2">
							Điểm số: <strong class="text-primary-500">{evaluationForm.score}</strong> / {maxScore}
						</p>
						<Slider
							value={sliderValue}
							onValueChange={(e) => {
								sliderValue[0] = e.value;
								evaluationForm.score = e.value;
							}}
							max={maxScore}
							step={1}
						/>
						<div class="flex justify-between text-sm text-surface-500 mt-2">
							<span>0</span>
							<span>{maxScore}</span>
						</div>
					</div>

					<!-- Comment -->
					<div>
						<label class="label" for="comment">
							<span class="font-semibold">Nhận xét:</span>
						</label>
						<textarea
							id="comment"
							name="comment"
							class="textarea mt-2"
							rows="4"
							bind:value={evaluationForm.comment}
							placeholder="Nhập nhận xét về tiêu chí này..."
						></textarea>
					</div>

					<!-- Evidence Upload -->
					<div>
						<label class="label font-semibold" for="evidence">Tải lên minh chứng</label>
						<div class="mt-2 space-y-3">
							<label 
								for="evidence-files"
								class="block border-2 border-surface-300-700 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
							>
								<Upload class="w-8 h-8 text-surface-400 mx-auto mb-2" />
								<div class="text-sm">
									<span class="text-primary-500 hover:text-primary-600">
										Chọn tệp tin
									</span>
								</div>
								<input
									id="evidence-files"
									name="evidenceFiles"
									type="file"
									accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
									class="hidden"
									onchange={handleFileSelect}
								/>
								<p class="text-xs text-surface-500 mt-1">
									Hỗ trợ: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (tối đa 10MB mỗi tệp)
								</p>
							</label>
							
							<!-- File list preview (if files are selected) -->
							<div id="file-preview" class="space-y-2 hidden">
								<h6 class="font-medium text-sm">Tệp đã chọn:</h6>
								<div id="file-list" class="space-y-1"></div>
							</div>
						</div>
					</div>

					<!-- Submit Buttons -->
					<div class="flex justify-end gap-4">
						<a class="btn preset-tonal" href="/reviews/details/{period.id}"> Hủy </a>
						<button type="submit" class="btn preset-filled-primary-500">
							<Save class="w-4 h-4" />
							{assignment?.score !== null ? 'Cập nhật đánh giá' : 'Lưu đánh giá'}
						</button>
					</div>
				</div>
			</div>
		</form>
	{:else}
		<div class="text-center py-12">
			<Info class="w-16 h-16 text-surface-400 mx-auto mb-4" />
			<h4 class="h4 text-surface-600-300 mb-2">Không tìm thấy tiêu chí</h4>
			<p class="text-surface-500">
				Tiêu chí bạn đang tìm không tồn tại hoặc không được gán cho bạn.
			</p>
			<a class="btn preset-tonal mt-4" href="/reviews/details/{period.id}"> Quay lại </a>
		</div>
	{/if}
</div>

<style>
	/* Add any additional styles here */
</style>
