<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import { Trash } from 'lucide-svelte';
	import { toaster } from './toaster';

	const { id } = $props();

	let openState = $state(false);

	function popoverClose() {
		openState = false;
	}

	function confimation() {
		popoverClose();
		toaster.promise(goto(`${page.url.pathname}/details/${id}/delete`), {
			loading: { title: 'Đang xoá...' },
			success: { title: 'Xoá thành công!', closable: false },
			error: { title: 'Xoá không thành công.', closable: false }
		});
		invalidateAll();
		window.location.reload();
	}
</script>

<Popover
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	positioning={{ placement: 'top' }}
	triggerBase="btn preset-filled-error-500"
	contentBase="card bg-white p-4 space-y-4 max-w-[320px] shadow-xl"
	arrow
	arrowBackground="!bg-white"
	ids={{ content: id }}
>
	{#snippet trigger()}<Trash /> Xoá{/snippet}
	{#snippet content()}
		<header class="flex justify-center">
			<p class="font-bold text-2xl">Xoá thông tin này?</p>
		</header>
		<footer class="flex justify-end gap-4">
			<button type="button" class="btn preset-tonal hover:preset-filled" onclick={popoverClose}>
				Huỷ thao tác
			</button>
			<button
				type="button"
				class="btn preset-filled-error-500 hover:preset-tonal"
				onclick={confimation}
			>
				Xoá thông tin
			</button>
		</footer>
	{/snippet}
</Popover>
