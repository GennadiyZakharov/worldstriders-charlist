<script lang="ts">
    import DotRating from "./DotRating.svelte";

    type Props = {
        name: string;
        labels: {
            specializations: string;
            specializationsShort: string;
            specializationsTitle: string;
            close: string;
        };
        enabled?: boolean;
        note?: string;
        value?: number;
        readonly?: boolean;
    };

    let {
        name,
        labels,
        enabled = $bindable(false),
        note = $bindable(""),
        value = $bindable(0),
        readonly = false
    }: Props = $props();

    let specializationsDialog: HTMLDialogElement;

    let dialogTitle = $derived(`${labels.specializationsTitle}: ${name}`);

    function openSpecializations() {
        specializationsDialog.showModal();
    }

    function clamp0to5(n: number): number {
        return Math.min(5, Math.max(0, Math.trunc(n)));
    }


    // Keep value clamped 0..5, avoid unnecessary write-backs
    $effect(() => {
        const v = clamp0to5(value);
        if (v !== value) value = v;
    });
</script>

<div class="row" class:readonly={readonly}>
    <input
            class="check"
            type="checkbox"
            bind:checked={enabled}
            disabled={readonly}
            aria-label={`${name} enabled`}
    />

    <div class="text">
        <div class="name ws-label">{name}</div>
    </div>

    <button
            class="specializationsButton ws-text"
            type="button"
            onclick={openSpecializations}
            aria-label={`${labels.specializations}: ${name}`}
    >
        {labels.specializationsShort}
    </button>

    <div class="rating">
        <DotRating
                label={name}
                bind:value
                min={0}
                max={5}
                shape="circle"
                showValue={false}
                readonly={readonly}
        />
    </div>
</div>

<dialog bind:this={specializationsDialog} aria-label={dialogTitle}>
    <div class="dialogContent">
        <h2 class="ws-h1">{dialogTitle}</h2>
        <textarea
                class="specializationsText ws-text"
                bind:value={note}
                readonly={readonly}
                aria-label={dialogTitle}
                rows="8"
        ></textarea>
        <button
                class="closeButton ws-text"
                type="button"
                onclick={() => specializationsDialog.close()}
                aria-label={labels.close}
        >
            {labels.close}
        </button>
    </div>
</dialog>

<style>
    .row {
        display: grid;
        grid-template-columns: 10px minmax(0, 1fr) auto auto;
        gap: 8px;
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
        min-width: 0;
    }

    .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .specializationsButton {
        white-space: nowrap;
    }

    .rating {
        min-width: 0;
    }

    button {
        border: 1px solid rgba(0, 0, 0, 0.25);
        background: white;
        border-radius: 8px;
        padding: 6px 8px;
        cursor: pointer;
        line-height: 1;
        user-select: none;
    }

    dialog {
        width: min(560px, calc(100vw - 32px));
        max-width: none;
        box-sizing: border-box;
        border: 1px solid rgba(0, 0, 0, 0.28);
        border-radius: 12px;
        padding: 20px;
    }

    dialog::backdrop {
        background: rgba(0, 0, 0, 0.35);
    }

    .dialogContent {
        display: grid;
        gap: 16px;
    }

    .dialogContent h2 {
        margin: 0;
    }

    .specializationsText {
        width: 100%;
        min-height: 160px;
        box-sizing: border-box;
        resize: vertical;
    }

    .closeButton {
        justify-self: end;
    }

    .readonly {
        opacity: 0.9;
    }

</style>
