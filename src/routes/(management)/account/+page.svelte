<script lang="ts">
	import CrudTable from '$lib/CRUDTable.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="p-8">
	<h2>Quản lý tài khoản</h2>
	<CrudTable
		data={data.data}
		presentation={['ID', 'Username', 'Họ tên', 'Email', 'SDT']}
		detailButton={false}
	/>
</div>
