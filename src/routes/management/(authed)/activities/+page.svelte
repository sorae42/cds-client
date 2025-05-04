<script lang="ts">
	import type { PageProps } from './$types';
	import Pagination from '$lib/Pagination.svelte';

	let { data }: PageProps = $props();
	let logs = $state(data.data);
	let currentPage = $state(data.pagination.page);
	let pageSize = $state(data.pagination.pageSize);

	function handlePageChange(event: { page: number }) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', event.page.toString());
		window.location.assign(url.toString());
	}

	function handlePageSizeChange(event: { pageSize: number }) {
		const url = new URL(window.location.href);
		url.searchParams.set('pageSize', event.pageSize.toString());
		url.searchParams.set('page', '1');
		window.location.assign(url.toString());
	}
</script>

<div class="p-8">
	<h3 class="h3 mb-4">Nhật ký hoạt động</h3>

	<table class="table">
		<thead>
			<tr>
				<th>Thời gian</th>
				<th>Người dùng</th>
				<th>Địa chỉ IP</th>
				<th>Hành động</th>
				<th>Chi tiết</th>
			</tr>
		</thead>
		<tbody>
			{#each logs as log}
				<tr>
					<td>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
					<td>{log.username}</td>
					<td>{log.ipAddress}</td>
					<td>{log.action}</td>
					<td>{log.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<Pagination
		data={logs}
		page={currentPage}
		{pageSize}
		count={data.pagination.totalCount}
		onPageChange={handlePageChange}
		onPageSizeChange={handlePageSizeChange}
	/>
</div>
