<script lang="ts">
    import { page } from '$app/state';
    import type { PageProps } from './$types';
    import TextInput from '$lib/crud/TextInput.svelte';
    import { enhance } from '$app/forms';

    let { data }: PageProps = $props();
</script>

<div class="p-8">
    <div class="card p-4">
        <h3 class="h3 mb-4">Tạo tiêu chí con mới</h3>
        <p class="mb-4">Thuộc tiêu chí: <strong>{data.parentCriteria.name}</strong></p>

        <form method="POST" use:enhance>
            <div class="space-y-4">
                <TextInput
                    name="name"
                    label="Tên tiêu chí:"
                    required
                />
                
                <TextInput
                    name="maxScore"
                    label="Điểm tối đa:"
                    type="number"
                    required
                />

                <TextInput
                    name="description"
                    label="Mô tả:"
                    type="text"
                />

                <TextInput
                    name="evidenceInfo"
                    label="Thông tin minh chứng:"
                    type="text"
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
                    Thêm mới
                </button>
            </footer>
        </form>
    </div>
</div>