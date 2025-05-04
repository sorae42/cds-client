<script lang="ts">
    import CrudTable from '$lib/CRUDTable.svelte';
    import Pagination from '$lib/Pagination.svelte';
    import { Plus, Search } from 'lucide-svelte';
    import type { PageProps } from './$types';
    import { page } from '$app/state';

    let { data }: PageProps = $props();
    let searchResults = $state(data.data);
    let searchTerm = $state('');
    let currentPage = $state(data.pagination.page);
    let pageSize = $state(data.pagination.pageSize);

    function updateSearch(e: Event) {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('search', searchTerm);
        url.searchParams.set('page', '1'); // Reset to first page on search
        window.location.assign(url.toString());
    }

    function handlePageChange(event: { page: number }) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', event.page.toString());
        window.location.assign(url.toString());
    }

    function handlePageSizeChange(event: { pageSize: number }) {
        const url = new URL(window.location.href);
        url.searchParams.set('pageSize', event.pageSize.toString());
        url.searchParams.set('page', '1'); // Reset to first page when changing page size
        window.location.assign(url.toString());
    }
</script>

<div class="p-8">
    <div class="flex justify-between pb-6">
        <a href="{page.url.pathname}/details/0/edit" class="btn preset-tonal-primary">
            <Plus /> Tạo người dùng mới
        </a>
        <form onsubmit={updateSearch} class="w-100">
            <div class="input-group grid-cols-[auto_1fr_auto]">
                <div class="ig-cell preset-tonal">
                    <Search size={16} />
                </div>
                <input 
                    class="ig-input" 
                    type="search"
                    bind:value={searchTerm}
                    placeholder="Tìm người dùng..." 
                />
                <button type="submit" class="ig-btn preset-filled">Tìm</button>
            </div>
        </form>
    </div>

    <CrudTable
        data={searchResults}
        presentation={['Username', 'Họ tên', 'SDT']}
        dataBody={['username', 'fullName', 'phone']}
        presentationSub={['Email']}
        dataSub={['email']}
        detailButton={false}
    />

    <Pagination 
        data={searchResults}
        page={currentPage}
        pageSize={pageSize}
        count={data.pagination.totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
    />
</div>
