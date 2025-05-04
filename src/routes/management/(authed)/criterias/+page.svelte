<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Pencil, Plus, SquareChevronDown, SquareChevronUp, Trash } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { Accordion, Modal, Tooltip } from '@skeletonlabs/skeleton-svelte';
	import TextInput from '$lib/crud/TextInput.svelte';
	import CrudTable from '$lib/CRUDTable.svelte';

	let { data }: PageProps = $props();
	let targetGroup: any;
	let selectBox: any = $state();
	let previousValue: number = $state(Number(page.url.searchParams.get('group')) || 1);
	let openAddGroup: boolean = $state(false);
	let openNewCriteria = $state(false);

	let groups: Array<any> = $state(data.targetGroup);

	let isEdit = $state(false);
	let openModal = $state(false);
	let currentGroupId = $state<string>('');
	let currentGroupName = $state<string>('');

	function submit() {
		if (selectBox == 0) {
			openAddGroup = true;
			selectBox = previousValue;
			return;
		}
		targetGroup.submit();
	}

	function handleEdit() {
		isEdit = true;
		const selectedGroup = groups.find((g) => g.id == selectBox);
		currentGroupId = selectBox;
		currentGroupName = selectedGroup?.name || '';
		openModal = true;
	}

	function handleNewCriteria() {
		const selectedGroup = groups.find((g) => g.id == selectBox);
		currentGroupId = selectBox; // Changed to use ID
		openNewCriteria = true;
	}

	let openEditCriteria = $state(false);
	let currentCriteriaId = $state<string>('');
	let currentCriteriaName = $state<string>('');

	function handleEditCriteria(criteria: any) {
		currentCriteriaId = criteria.id;
		currentCriteriaName = criteria.name;
		currentGroupId = selectBox; // Changed to use ID
		openEditCriteria = true;
	}
</script>

<div class="p-8 flex justify-between">
	<form
		action="?/targetGroupChange"
		use:enhance={() => {
			return async ({ result }) => {
				applyAction(result);
			};
		}}
		bind:this={targetGroup}
		method="POST"
		class="flex gap-1 items-center"
	>
		<div class="input-group grid-cols-[auto_1fr_auto]">
			<select
				name="target-group"
				id="target-group"
				onchange={submit}
				bind:value={selectBox}
				class="ig-select"
			>
				{#each groups as targets}
					<option value={targets.id} selected={targets.id == data.groupDetails.id ? true : false}
						>{targets.name}</option
					>
				{/each}
				<option value="0">+ Thêm nhóm tiêu chỉ mới...</option>
			</select>
			<button
				type="button"
				class="ig-btn preset-filled h-full flex items-center"
				onclick={handleEdit}
			>
				<Pencil />
			</button>
		</div>
	</form>
	<div>
		<button class="btn preset-tonal-primary" onclick={handleNewCriteria}>
			<Plus />Tạo tiêu chí mới
		</button>
	</div>
</div>

<Accordion multiple collapsible classes="p-8 pt-0">
	{#snippet iconOpen()}
		<SquareChevronUp />
	{/snippet}
	{#snippet iconClosed()}
		<SquareChevronDown />
	{/snippet}
	{#each data.groupDetails.parentCriterias as criteria, index}
		<Accordion.Item
			value={criteria.id}
			headingElement="span"
			controlClasses="font-bold"
			classes="border border-gray-400 rounded-sm"
		>
			{#snippet control()}
				<span class="flex justify-between items-center">
					<span class="flex items-center gap-2">
						<span class="badge-icon preset-outlined-surface-500">
							{index + 1}
						</span>
						{criteria.name}
					</span>
					<div>
						<span class="badge preset-outlined-surface-500 w-24">
							{data.criterias[index].subCriterias.length} tiêu chí
						</span>
						<span class="badge preset-outlined-surface-500 w-24">
							{criteria.totalScore} điểm
						</span>
					</div>
				</span>
			{/snippet}
			{#snippet panel()}
				<div class="flex justify-between">
					<span>
						<button
							type="button"
							class="btn preset-filled-primary-500"
							onclick={() => handleEditCriteria(criteria)}
						>
							<Pencil />Đổi tên
						</button>
						<!-- <a href="#" class="btn preset-tonal-error">
							<Trash />Xoá
						</a> -->
					</span>
					<a href="{page.url.pathname}/new/{data.criterias[index].id}" class="btn preset-tonal-primary">
						<Plus />Tạo tiêu chí con mới
					</a>
				</div>
				<CrudTable
					data={data.criterias[index].subCriterias}
					presentation={['Tiêu chí', 'Tổng điểm']}
					dataBody={['name', 'maxScore']}
					presentationSub={['Minh chứng']}
					dataSub={['evidenceInfo']}
					detailButton={false}
				/>
			{/snippet}
		</Accordion.Item>
	{/each}
</Accordion>

<Modal
	open={openAddGroup}
	onOpenChange={(e) => (openAddGroup = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form action="?/newTargetGroup" method="POST">
			<article>
				<TextInput name="target-group" label="Nhập tên nhóm chỉ tiêu mới:" />
			</article>
			<footer class="flex justify-between gap-4">
				<button
					type="button"
					class="btn preset-tonal"
					onclick={() => {
						openAddGroup = false;
					}}>Huỷ</button
				>
				<button type="submit" class="btn preset-filled"><Plus />Thêm mới</button>
			</footer>
		</form>
	{/snippet}
</Modal>

<Modal
	open={openModal}
	onOpenChange={(e) => (openModal = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form action="?/renameTargetGroup" method="POST">
			<article>
				<TextInput name="target-group" label="Đổi tên nhóm chỉ tiêu:" value={currentGroupName} />
				<input type="hidden" name="id" value={currentGroupId} />
			</article>
			<footer class="flex justify-between gap-4">
				<button type="button" class="btn preset-tonal" onclick={() => (openModal = false)}>
					Huỷ
				</button>
				<button type="submit" class="btn preset-filled">
					<Plus />Cập nhật
				</button>
			</footer>
		</form>
	{/snippet}
</Modal>

<Modal
	open={openNewCriteria}
	onOpenChange={(e) => (openNewCriteria = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form action="?/newCriteria" method="POST">
			<article class="space-y-4">
				<TextInput name="criteria-name" label="Tên tiêu chí:" />
				<input type="hidden" name="target-group" value={currentGroupId} />
			</article>
			<footer class="flex justify-between gap-4">
				<button type="button" class="btn preset-tonal" onclick={() => (openNewCriteria = false)}>
					Huỷ
				</button>
				<button type="submit" class="btn preset-filled">
					<Plus />Thêm mới
				</button>
			</footer>
		</form>
	{/snippet}
</Modal>

<Modal
    open={openEditCriteria}
    onOpenChange={(e) => (openEditCriteria = e.open)}
    triggerBase="btn preset-tonal"
    contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <form action="?/renameCriteria" method="POST">
            <article>
                <TextInput 
                    name="criteria-name" 
                    label="Đổi tên tiêu chí:" 
                    value={currentCriteriaName} 
                />
                <input type="hidden" name="id" value={currentCriteriaId} />
                <input type="hidden" name="target-group" value={currentGroupId} />
            </article>
            <footer class="flex justify-between gap-4">
                <button 
                    type="button" 
                    class="btn preset-tonal" 
                    onclick={() => (openEditCriteria = false)}
                >
                    Huỷ
                </button>
                <button type="submit" class="btn preset-filled">
                    <Plus />Cập nhật
                </button>
            </footer>
        </form>
    {/snippet}
</Modal>
