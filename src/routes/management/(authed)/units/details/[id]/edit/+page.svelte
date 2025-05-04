<script lang="ts">
    import Form from '$lib/crud/Form.svelte';
    import TextInput from '$lib/crud/TextInput.svelte';
    import type { PageProps } from './$types';

    const { data }: PageProps = $props();
    const unit = structuredClone(data.units);
</script>

<div class="p-4">
    <h1>Chỉnh sửa đơn vị</h1>

    <Form id={unit?.id || 0}>
        <fieldset>
            <legend>Thông tin đơn vị</legend>
            <TextInput 
                name="name" 
                label="Tên đơn vị" 
                value={unit.name} 
                required={true} 
            />
            <TextInput 
                name="code" 
                label="Mã đơn vị" 
                value={unit.code} 
                required={true} 
            />
            <TextInput 
                name="type" 
                label="Loại đơn vị" 
                value={unit.type} 
                required={true} 
            />
            <TextInput 
                name="address" 
                label="Địa chỉ" 
                value={unit.address || ''} 
            />
            <TextInput 
                name="description" 
                label="Mô tả" 
                value={unit.description || ''}
            />
        </fieldset>
    </Form>
</div>