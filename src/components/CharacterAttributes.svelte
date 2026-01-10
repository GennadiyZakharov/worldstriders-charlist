<script lang="ts">
    import Attribute from "./Attribute.svelte";

    export type AttrKey =
        | "intellect"
        | "quickWits"
        | "determination"
        | "magic"
        | "luck"
        | "bodyControl"
        | "impressiveness"
        | "manipulation"
        | "composure";

    export let title: string;

    export let labels: Record<AttrKey, string>;

    export let values: Record<AttrKey, number>;
</script>

<section class="attrs">
    <h1 class="ws-h1">{title}</h1>

    <div class="grid">
        <!-- Column 1 -->
        <div class="col">
            <Attribute
                    name={labels.intellect}
                    bind:value={values.intellect}
            />
            <Attribute
                    name={labels.quickWits}
                    bind:value={values.quickWits}
            />
            <Attribute
                    name={labels.determination}
                    bind:value={values.determination}
            />
        </div>

        <!-- Column 2 -->
        <div class="col">
            <Attribute
                    name={labels.magic}
                    bind:value={values.magic}
            />
            <Attribute
                    name={labels.luck}
                    bind:value={values.luck}
            />
            <Attribute
                    name={labels.bodyControl}
                    bind:value={values.bodyControl}
            />
        </div>

        <!-- Column 3 -->
        <div class="col">
            <Attribute
                    name={labels.impressiveness}
                    bind:value={values.impressiveness}
            />
            <Attribute
                    name={labels.manipulation}
                    bind:value={values.manipulation}
            />
            <Attribute
                    name={labels.composure}
                    bind:value={values.composure}
            />
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
