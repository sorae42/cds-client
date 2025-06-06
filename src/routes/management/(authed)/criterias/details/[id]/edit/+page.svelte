<script lang="ts">
    import { page } from '$app/state';
    import type { PageProps } from './$types';
    import TextInput from '$lib/crud/TextInput.svelte';
    import { enhance } from '$app/forms';

    let { data }: PageProps = $props();

    let selectedFile: File | null = null;

    function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            addFile(input.files[0]);
        }
    }

    function addFile(file: File) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert(`Tệp "${file.name}" vượt quá giới hạn 10MB`);
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
            alert(`Loại tệp "${file.name}" không được hỗ trợ`);
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

    if (typeof window !== 'undefined') {
        (window as any).removeFile = removeFile;
    }
</script>

<div class="p-8">
    <div class="card p-4">
        <h3 class="h3 mb-4">Chỉnh sửa tiêu chí</h3>

        <form method="POST" use:enhance enctype="multipart/form-data">
            <div class="space-y-4">
                <TextInput
                    name="name"
                    label="Tên tiêu chí:"
                    value={data.subCriteria.name}
                    required
                />
                
                <TextInput
                    name="maxScore"
                    label="Điểm tối đa:"
                    type="number"
                    value={data.subCriteria.maxScore}
                    required
                />

                <TextInput
                    name="description"
                    label="Mô tả:"
                    type="text"
                    value={data.subCriteria.description}
                />

                <!-- Evidence Upload -->
                <div>
                    <label class="label font-semibold" for="evidence">Tải lên minh chứng</label>
                    <div class="mt-2 space-y-3">
                        <label 
                            for="evidence-files"
                            class="block border-2 border-surface-300-700 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                        >
                            <div class="text-sm">
                                <span class="text-primary-500 hover:text-primary-600">
                                    Chọn tệp tin
                                </span>
                            </div>
                            <input
                                id="evidence-files"
                                name="evidenceFile"
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

                <TextInput
                    name="evidenceInfo"
                    label="Thông tin minh chứng:"
                    type="text"
                    value={data.subCriteria.evidenceInfo}
                />
            </div>

            <footer class="flex justify-between mt-8">
                <a 
                    href="/management/criterias" 
                    class="btn preset-tonal"
                >
                    Huỷ
                </a>
                <button type="submit" class="btn preset-filled">
                    Cập nhật
                </button>
            </footer>
        </form>
    </div>
</div>