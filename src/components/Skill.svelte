<script lang="ts">
    import DotRating from "./DotRating.svelte";

    function clamp05(n: number): number {
        if (!Number.isFinite(n)) return 0;
        return Math.min(5, Math.max(0, Math.trunc(n)));
    }

    let {
        name,
        enabled = $bindable(false),
        note = $bindable(""),
        value = $bindable(0),
        readonly = false
    } = $props<{
        name: string;
        enabled?: boolean;
        note?: string;
        value?: number;
        readonly?: boolean;
    }>();

    // Keep value always clamped 0..5 (same behavior as your $: line)
    $effect(() => {
        value = clamp05(value);
    });
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
    </div>

    <input
            class="note"
            type="text"
            bind:value={note}
            disabled={readonly}
            placeholder=""
            aria-label={`${name} note`}
    />

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
        grid-template-columns: 10px auto 1fr auto;
        gap: 10px;
        align-items: center;
    }

    .check {
        width: 10px;
        height: 10px;
        margin: 0;
    }

    .text {
        display: grid;
        gap: 4px;
    }

    .name {
        font-weight: 300;
        font-size: 12px;
        white-space: nowrap;
    }

    .note {
        width: 100%;
        height: 20px;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.28);
        border-radius: 0;
        padding: 0 4px;
        font-size: 12px;
        background: transparent;
        min-width: 0;
    }

    .readonly {
        opacity: 0.9;
    }
</style>
