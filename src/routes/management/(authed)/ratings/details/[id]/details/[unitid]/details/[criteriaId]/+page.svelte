<script lang="ts">
    import { ArrowLeft, FileText, Plus, CheckCircle, Clock } from 'lucide-svelte';
    import CRUDTable from '$lib/CRUDTable.svelte';
    import { Modal } from '@skeletonlabs/skeleton-svelte';
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import { toaster } from '$lib/toaster';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    // Modal state
    let openAssignModal = $state(false);
    let selectedSubCriteriaId = $state<number | null>(null);

    // Transform assigned sub-criterias for table display
    const assignedSubCriteriasTableData = data.assignedSubCriterias?.map((assignment: any) => ({
        id: assignment.subCriteriaId,
        name: assignment.subCriteriaName || 'Chưa có tên',
        maxScore: assignment.maxScore || 'Chưa xác định',
        description: assignment.description || 'Chưa có mô tả',
        status: assignment.score !== null ? 'Đã đánh giá' : 'Chưa đánh giá',
        score: assignment.score || 'Chưa có',
        assignmentId: assignment.assignmentId,
        evaluatedAt: assignment.evaluatedAt
    })) || [];

    // Filter available sub-criterias (not yet assigned)
    const availableSubCriterias = data.subCriterias?.filter((subCriteria: any) => 
        !data.assignedSubCriterias?.some((assignment: any) => assignment.subCriteriaId === subCriteria.id)
    ) || [];

    function handleModalClose() {
        openAssignModal = false;
        selectedSubCriteriaId = null;
    }
</script>

<div class="p-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
        <a href="../" class="btn preset-outlined-surface-500">
            <ArrowLeft />
        </a>
        <div>
            <h3 class="h3">Chi tiết tiêu chí đánh giá</h3>
            <p class="text-sm text-surface-600-300">
                {data.period.name} → {data.unit.name} → {data.parentCriteria.name}
            </p>
        </div>
    </div>

    <!-- Quick Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card p-4 text-center">
            <p class="text-lg font-bold text-warning-500">{data.assignedSubCriterias?.length || 0}</p>
            <p class="text-sm text-surface-600-300">Đã gán</p>
        </div>
        <div class="card p-4 text-center">
            <p class="text-lg font-bold text-error-500">{availableSubCriterias.length}</p>
            <p class="text-sm text-surface-600-300">Chưa gán</p>
        </div>
    </div>

    <!-- Assigned Sub-criterias Table -->
    <div class="card p-4">
        <div class="flex justify-between items-center gap-2 mb-4">
            <h4 class="h4">Tiêu chí con đã gán ({data.assignedSubCriterias?.length || 0})</h4>
            {#if availableSubCriterias.length > 0}
                <button class="btn preset-tonal-primary" onclick={() => (openAssignModal = true)}>
                    <Plus /> Gán thêm tiêu chí
                </button>
            {/if}
        </div>

        {#if assignedSubCriteriasTableData.length > 0}
            <CRUDTable
                data={assignedSubCriteriasTableData}
                presentation={['Tên tiêu chí', 'Điểm tối đa', 'Trạng thái']}
                dataBody={['name', 'maxScore', 'status']}
                presentationSub={['Mô tả', 'Điểm đã chấm', 'Ngày đánh giá']}
                dataSub={['description', 'score', 'evaluatedAt']}
                detailButton={false}
                updateButton={false}
                deleteButton={false}
            />
        {:else}
            <div class="text-center py-8">
                <FileText class="w-12 h-12 text-surface-400 mx-auto mb-3" />
                <p class="text-surface-500">Chưa có tiêu chí con nào được gán cho đơn vị này</p>
            </div>
        {/if}
    </div>

    <!-- Available Sub-criterias (if any) -->
    {#if availableSubCriterias.length > 0}
        <div class="card p-4">
            <h4 class="h4 mb-4">Tiêu chí con chưa gán ({availableSubCriterias.length})</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each availableSubCriterias as subCriteria}
                    <div class="card bg-surface-50-950 p-3 border border-dashed border-surface-300-600">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-sm font-medium">{subCriteria.name}</span>
                            <span class="badge preset-outlined-warning-500 text-xs">
                                {subCriteria.maxScore || 0} điểm
                            </span>
                        </div>
                        {#if subCriteria.description}
                            <p class="text-xs text-surface-500">{subCriteria.description}</p>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<!-- Assign Sub-Criterias Modal -->
<Modal
    open={openAssignModal}
    onOpenChange={(e) => (openAssignModal = e.open)}
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <form 
            action="?/assignSubCriterias" 
            method="POST"
            use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'failure') {
                        toaster.error({
                            title: result.data?.message || 'Gán tiêu chí thất bại',
                        });
                        return;
                    }
                    if (result.type === 'success') {
                        handleModalClose();
                        toaster.success({
                            title: result.data?.message || 'Gán tiêu chí thành công!',
                        });
                        invalidateAll();
                        window.location.reload();
                    }
                };
            }}
        >
            <header class="flex justify-between items-center mb-6">
                <h3 class="h3">Gán tiêu chí con cho đơn vị</h3>
            </header>

            <article class="space-y-4">
                <div class="card bg-surface-50-950 p-4">
                    <p class="text-sm font-medium mb-2">Thông tin gán tiêu chí:</p>
                    <div class="grid grid-cols-1 gap-2 text-sm">
                        <div><strong>Đơn vị:</strong> {data.unit.name}</div>
                        <div><strong>Tiêu chí cha:</strong> {data.parentCriteria.name}</div>
                        <div><strong>Kỳ đánh giá:</strong> {data.period.name}</div>
                    </div>
                </div>

                <div class="card p-4">
                    <p class="text-sm font-medium mb-4">Chọn một tiêu chí con để gán cho đơn vị:</p>
                    {#if availableSubCriterias.length > 0}
                        <div class="space-y-2 max-h-60 overflow-y-auto">
                            {#each availableSubCriterias as subCriteria}
                                <label class="flex items-start gap-3 p-3 hover:bg-surface-hover rounded border border-surface-300-600 cursor-pointer {selectedSubCriteriaId === subCriteria.id ? 'ring-2 ring-primary-500' : ''}">
                                    <input
                                        type="radio"
                                        name="subCriteriaId"
                                        value={subCriteria.id}
                                        bind:group={selectedSubCriteriaId}
                                        class="form-radio mt-0.5"
                                    />
                                    <span class="text-sm font-medium">{subCriteria.name}</span>
                                </label>
                            {/each}
                        </div>
                    {:else}
                        <div class="text-center py-8">
                            <CheckCircle class="w-12 h-12 text-success-400 mx-auto mb-3" />
                            <p class="text-surface-500">Tất cả tiêu chí con đã được gán cho đơn vị này</p>
                        </div>
                    {/if}
                </div>
            </article>

            <footer class="flex justify-between gap-4 mt-6">
                <button type="button" class="btn preset-tonal" onclick={handleModalClose}>
                    Hủy
                </button>
                <button type="submit" class="btn preset-filled-primary-500" disabled={!selectedSubCriteriaId}>
                    <Plus class="w-4 h-4" />
                    Gán tiêu chí đã chọn
                </button>
            </footer>
        </form>
    {/snippet}
</Modal>
