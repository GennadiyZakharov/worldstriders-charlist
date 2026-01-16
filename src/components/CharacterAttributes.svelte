<script lang="ts">
    import Attribute from "./Attribute.svelte";
    import type { Attributes } from "../types"; // adjust path

    type Props = {
        title: string;
        labels: Record<keyof Attributes, string>;
        attributes?: Attributes;
        readonly?: boolean;
    };

    let {
        title,
        labels,
        attributes = $bindable<Attributes>(),
        readonly = false
    } = $props<Props>();
</script>

<section class="attrs">
    <h1 class="ws-h1">{title}</h1>

    <div class="grid">
        <!-- Column 1 -->
        <div class="col">
            <Attribute name={labels.intellect} bind:value={attributes.intellect} {readonly} />
            <Attribute name={labels.quickWits} bind:value={attributes.quickWits} {readonly} />
            <Attribute name={labels.determination} bind:value={attributes.determination} {readonly} />
        </div>

        <!-- Column 2 -->
        <div class="col">
            <Attribute name={labels.magic} bind:value={attributes.magic} {readonly} />
            <Attribute name={labels.luck} bind:value={attributes.luck} {readonly} />
            <Attribute name={labels.bodyControl} bind:value={attributes.bodyControl} {readonly} />
        </div>

        <!-- Column 3 -->
        <div class="col">
            <Attribute name={labels.impressiveness} bind:value={attributes.impressiveness} {readonly} />
            <Attribute name={labels.manipulation} bind:value={attributes.manipulation} {readonly} />
            <Attribute name={labels.composure} bind:value={attributes.composure} {readonly} />
        </div>
    </div>
</section>

<style>
    .attrs {
        display: grid;
        gap: 12px;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        align-items: start;
    }

    .col {
        display: grid;
        gap: 8px;
        align-content: start;
    }

    @media (max-width: 900px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>
