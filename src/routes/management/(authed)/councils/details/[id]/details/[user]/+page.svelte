<script lang="ts">
    import { ArrowLeft } from 'lucide-svelte';
    import CRUDTable from '$lib/CRUDTable.svelte';
    import CriteriaTree from './CriteriaTree.svelte';

    let { data } = $props();
    
    // Transform assignments data for the table
    let assignmentTableData = $state(data.assignments.map((assignment: any) => ({
        id: assignment.reviewAssignmentId || assignment.id,
        unit: assignment.unitName,
        criteria: assignment.subCriteriaName
    })));
</script>

<div class="p-8 space-y-8">
    <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
            <a href="../" class="btn preset-outlined-surface-500">
                <ArrowLeft />
            </a>
            <h3 class="h3">Chi tiết thành viên hội đồng</h3>
        </div>
    </div>

    <div class="card p-4">
        <div class="flex justify-between items-center mb-4">
            <h4 class="h4">Phân công đánh giá ({assignmentTableData.length})</h4>
            <CriteriaTree
                units={data.units}
                reviewerId={data.reviewer}
            />
        </div>

        {#if assignmentTableData.length > 0}
            <CRUDTable 
                data={assignmentTableData}
                presentation={['Đơn vị', 'Tiêu chí']}
                dataBody={['unit', 'criteria']}
                detailButton={false}
                updateButton={false}
                deleteButton={false}
            />
        {:else}
            <p class="text-gray-500">Chưa có phân công nào</p>
        {/if}
    </div>
</div>