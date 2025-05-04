<script lang="ts">
	import CrudTable from '$lib/CRUDTable.svelte';
	import { Plus, Search } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { page } from '$app/state';

	let { data }: PageProps = $props();
	console.log(data.data);
</script>

<div class="p-8">
	<div class="flex justify-between pb-6">
		<a href="{page.url.pathname}/details/0/edit" class="btn preset-tonal-primary"
			><Plus /> Tạo đơn vị mới</a
		>
		<div class="input-group grid-cols-[auto_1fr_auto] w-100 hidden">
			<div class="ig-cell preset-tonal">
				<Search size={16} />
			</div>
			<input class="ig-input" type="search" placeholder="Tìm người dùng..." />
			<button class="ig-btn preset-filled">Tìm</button>
		</div>
	</div>
	<CrudTable
		data={data.data}
		presentation={['Mã', 'Tên', 'Loại']}
		dataBody={['code', 'name', 'type']}
		presentationSub={['Địa chỉ', 'Mô tả']}
		dataSub={['address', 'description']}
	/>
</div>
