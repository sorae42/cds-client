<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Plus, SquareChevronDown, SquareChevronUp } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { Accordion, Modal } from '@skeletonlabs/skeleton-svelte';
	import TextInput from '$lib/crud/TextInput.svelte';
	import CrudTable from '$lib/CRUDTable.svelte';

	let { data }: PageProps = $props();
	let targetGroup: any;
	let selectBox: any = $state();
	let previousValue: number = $state(Number(page.url.searchParams.get('group')) || 1);
	let openAddGroup: boolean = $state(false);

	function submit() {
		if (selectBox == 0) {
			openAddGroup = true;
			selectBox = previousValue;
			return;
		}
		targetGroup.submit();
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
				{#each data.targetGroup as targets}
					<option value={targets.id} selected={targets.id == data.groupDetails.id ? true : false}
						>{targets.name}</option
					>
				{/each}
			</select>
		</div>
	</form>
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
				<CrudTable
					data={data.criterias[index].subCriterias}
					presentation={['Tiêu chí', 'Tổng điểm']}
					dataBody={['name', 'maxScore']}
					presentationSub={['Minh chứng']}
					dataSub={['evidenceInfo']}
					detailButton={false}
					updateButton={false}
					deleteButton={false}
				/>
			{/snippet}
		</Accordion.Item>
	{/each}
</Accordion>

<Modal
	open={openAddGroup}
	onOpenChange={(e) => (openAddGroup = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 w-100 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form
			action="?/newTargetGroup"
			use:enhance={() => {
				console.log('whoe!');
				return async ({ result }) => {
					console.log(result);
					if (result.type === 'success') {
						openAddGroup = false;
					}
				};
			}}
			method="POST"
		>
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
