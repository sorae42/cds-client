<script lang="ts">
	import CrudTable from '$lib/CRUDTable.svelte';

	const demo = [
		{
			id: '1',
			username: 'amybibi',
			email: 'amybibi@mail.com',
			phone: '09169696969'
		},
		{
			id: '2',
			username: 'nhhai',
			email: 'hai2k3@mail.com',
			phone: '09169420303'
		}
	];
</script>

<div>
	<CrudTable data={demo} presentation={['ID', 'Ten', 'Email', 'SDT']} />
</div>
