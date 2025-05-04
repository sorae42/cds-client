<script lang="ts">
    import { page } from '$app/state';
    import type { PageProps } from './$types';
    import TextInput from '$lib/crud/TextInput.svelte';
    import { enhance } from '$app/forms';

    let { data }: PageProps = $props();
</script>

<div class="p-8">
    <div class="card p-4">
        <h3 class="h3 mb-4">Chỉnh sửa tiêu chí</h3>

        <form method="POST" use:enhance>
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