<script lang="ts">
    import { Plus } from 'lucide-svelte';
    import CRUDTable from '$lib/CRUDTable.svelte';
    import { Modal } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from '$app/forms';

    let { data } = $props();
    let period = data.period;
    let openUnitsModal = $state(false);

    // Form reference to submit from modal
    let sharedForm: HTMLFormElement;

    // Transform data for units table only
    const unitTableData =
        period.units?.map((unit: any) => ({
            id: unit.id,
            name: unit.name,
            code: unit.code,
            type: unit.type
        })) || [];

    function submitForm() {
        sharedForm.requestSubmit();
    }
</script>

<div class="p-8 space-y-8">
    <div class="flex justify-between items-center">
        <h3 class="h3">Chi tiết kỳ đánh giá</h3>
        <div class="flex gap-2">
            <a href="/management/ratings" class="btn preset-tonal">Quay lại</a>
        </div>
    </div>

    <div class="card p-4 space-y-4">
        <h4 class="h4">Thông tin chung</h4>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <strong>Tên kỳ:</strong>
                {period.name}
            </div>
            <div>
                <strong>Trạng thái:</strong>
                {period.isLocked ? 'Đã khoá' : 'Đang mở'}
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

    <div class="card p-4">
        <div class="flex justify-between items-center mb-4">
            <h4 class="h4">Đơn vị tham gia ({period.units?.length || 0})</h4>
            <button class="btn preset-tonal-primary" onclick={() => (openUnitsModal = true)}>
                Quản lý đơn vị
            </button>
        </div>
        <CRUDTable
            data={unitTableData}
            presentation={['Tên đơn vị', 'Mã', 'Loại']}
            dataBody={['name', 'code', 'type']}
            updateButton={false}
            deleteButton={false}
        />
    </div>
</div>

<!-- Hidden shared form -->
<form
    bind:this={sharedForm}
    action="?/updatePeriod"
    method="POST"
    class="hidden"
    use:enhance={() => {
        return async ({ result }) => {
            if (result.type === 'success') {
                openUnitsModal = false;
                window.location.reload();
            }
        };
    }}
>
    <!-- Units checkboxes -->
    {#if data.availableUnits && data.availableUnits.length > 0}
        {#each data.availableUnits as unit}
            {@const isSelected = period.units?.some((u: any) => u.id === unit.id)}
            <input
                type="checkbox"
                name="unitIds[]"
                value={unit.id}
                checked={isSelected}
                data-unit-id={unit.id}
            />
        {/each}
    {/if}
</form>

<!-- Units Modal -->
<Modal
    open={openUnitsModal}
    onOpenChange={(e) => (openUnitsModal = e.open)}
    triggerBase="btn preset-tonal"
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-100 max-w-screen-md"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <header class="flex justify-between items-center px-3 gap-6 mb-4">
            <h3 class="h3">Đơn vị tham gia</h3>
        </header>

        <article class="space-y-4">
            <div class="card p-4">
                {#if data.availableUnits && data.availableUnits.length > 0}
                    {#each data.availableUnits as unit}
                        {@const isSelected = period.units?.some((u: any) => u.id === unit.id)}
                        <label class="flex items-center gap-2 p-2 hover:bg-surface-hover rounded">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                class="form-checkbox"
                                onchange={(e) => {
                                    if (e.target && e.target instanceof HTMLInputElement) {
                                        const hiddenInput = sharedForm.querySelector(`[data-unit-id="${unit.id}"]`);
                                        if (hiddenInput instanceof HTMLInputElement) {
                                            hiddenInput.checked = e.target.checked;
                                        }
                                    }
                                }}
                            />
                            <span class="text-sm flex-1 {isSelected ? 'text-surface-400' : ''}">{unit.name} ({unit.code})</span>
                        </label>
                    {/each}
                {/if}
            </div>
        </article>

        <footer class="flex justify-between mt-6 px-4">
            <button type="button" class="btn preset-tonal" onclick={() => (openUnitsModal = false)}>
                Huỷ
            </button>
            <button type="button" class="btn preset-filled" onclick={submitForm}>
                <Plus />Cập nhật
            </button>
        </footer>
    {/snippet}
</Modal>