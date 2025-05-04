<script lang="ts">
    import { enhance } from '$app/forms';
    import TextInput from '$lib/crud/TextInput.svelte';

    let { data } = $props();
    
    // Convert ISO dates to local datetime-local format
    $effect(() => {
        if (data.period) {
            data.period.startDate = new Date(data.period.startDate).toISOString().slice(0, 16);
            data.period.endDate = new Date(data.period.endDate).toISOString().slice(0, 16);
        }
    });
</script>

<div class="p-8">
    <div class="card p-4">
        <h3 class="h3 mb-4">{data.period ? 'Chỉnh sửa kỳ đánh giá' : 'Tạo kỳ đánh giá mới'}</h3>

        <form method="POST" use:enhance>
            <div class="space-y-4">
                <TextInput
                    name="name"
                    label="Tên kỳ đánh giá:"
                    value={data.period?.name}
                    required
                />
                
                <TextInput
                    name="startDate"
                    label="Ngày bắt đầu:"
                    type="datetime-local"
                    value={data.period?.startDate}
                    required
                />

                <TextInput
                    name="endDate"
                    label="Ngày kết thúc:"
                    type="datetime-local"
                    value={data.period?.endDate}
                    required
                />
            </div>

            <footer class="flex justify-between mt-8">
                <a href="/management/ratings" class="btn preset-tonal">Huỷ</a>
                <button type="submit" class="btn preset-filled">
                    {data.period ? 'Cập nhật' : 'Thêm mới'}
                </button>
            </footer>
        </form>
    </div>
</div>