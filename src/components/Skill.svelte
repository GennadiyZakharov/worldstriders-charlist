<script lang="ts">
    import DotRating from "./DotRating.svelte";

    /** Display name (already translated before passing in). */
    export let name: string;

    /** Checkbox state (left square in the screenshot). */
    export let enabled: boolean = false;

    /** Free-text specialization / note (the underlined line). */
    export let note: string = "-";

    /** Skill rating (0..5 dots). Default 0. */
    export let value: number = 0;

    /** Optional: disable editing */
    export let readonly: boolean = false;

    function clamp05(n: number): number {
        if (!Number.isFinite(n)) return 0;
        return Math.min(5, Math.max(0, Math.trunc(n)));
    }

    $: value = clamp05(value);
</script>

<div class="row" class:readonly>
    <input
            class="check"
            type="checkbox"
            bind:checked={enabled}
            disabled={readonly}
            aria-label={`${name} enabled`}
    />

    <div class="text">
        <div class="name">{name}</div>
        <input
                class="note"
                type="text"
                bind:value={note}
                disabled={readonly}
                placeholder=""
                aria-label={`${name} note`}
        />
    </div>

    <DotRating
            label={name}
            bind:value
            min={0}
            max={5}
            shape="circle"
            showValue={false}
            {readonly}
    />
</div>

<style>
    .row {
        display: grid;
        grid-template-columns: 18px 1fr auto;
        gap: 10px;
        align-items: center;
    }

    .check {
        width: 16px;
        height: 16px;
        margin: 0;
    }

    .text {
        display: grid;
        gap: 4px;
    }

    .name {
        font-weight: 300;
        font-size: 12px;
    }

    .note {
        height: 28px;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.28);
        border-radius: 0;
        padding: 0 4px;
        font-size: 13px;
        background: transparent;
    }

    .readonly {
        opacity: 0.9;
    }
</style>
