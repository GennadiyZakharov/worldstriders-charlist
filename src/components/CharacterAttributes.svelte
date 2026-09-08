<script lang="ts">
    import Attribute from "./Attribute.svelte";
    import type { Attributes } from "../lib/types"; // adjust path

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
    }: Props = $props();
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
        grid-template-columns: repeat(3, minmax(0, 268px));
        gap: 24px;
        align-items: start;
        justify-content: center;
    }

    .col {
        position: relative;
        display: grid;
        gap: 8px;
        align-content: start;
        min-width: 0;
    }

    .attrs .col :global(.attr),
    .attrs .col :global(.name) {
        min-width: 0;
    }

    .attrs .col :global(.name) {
        white-space: normal;
        overflow-wrap: anywhere;
    }

    .col:not(:first-child)::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -12px;
        border-left: 1px solid rgba(0, 70, 95, 0.45);
    }

    @media (max-width: 924px) {
        .grid {
            grid-template-columns: min(100%, 268px);
        }

        .col:not(:first-child)::before {
            top: -12px;
            right: 0;
            bottom: auto;
            left: 0;
            border-top: 1px solid rgba(0, 70, 95, 0.35);
            border-left: 0;
        }
    }
</style>
