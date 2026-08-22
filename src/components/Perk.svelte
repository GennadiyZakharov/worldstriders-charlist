<script lang="ts">
  import DotRating from "./DotRating.svelte";

  type Props = {
    text?: string;
    description?: string;
    level?: number;
    labels: {
      description: string;
      descriptionTitle: string;
      close: string;
    };
    readonly?: boolean;
  };

  let {
    text = $bindable(""),
    description = $bindable(""),
    level = $bindable(0),
    labels,
    readonly = false
  }: Props = $props();

  let descriptionDialog: HTMLDialogElement;

  function openDescription() {
    descriptionDialog.showModal();
  }

  function clamp05(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.min(5, Math.max(0, Math.trunc(n)));
  }

  function onBlurText() {
    // Optional: normalize user input without fighting them while typing
    const t = text.trim();
    if (t !== text) text = t;
  }

  // Keep `level` always clamped, including when updated via bind:value
  $effect(() => {
    const clamped = clamp05(level);
    if (clamped !== level) level = clamped;
  });
</script>

<div class="row" class:readonly={readonly}>
  <input
    class="perkText ws-text"
    type="text"
    bind:value={text}
    disabled={readonly}
    aria-label={`Perk text${text ? `: ${text}` : ""}`}
    onblur={onBlurText}
  />

  <button
    class="descriptionButton ws-text"
    type="button"
    onclick={openDescription}
    aria-label={labels.description}
  >
    {labels.description}
  </button>

  <DotRating
    bind:value={level}
    min={0}
    max={5}
    shape="circle"
    showValue={false}
    {readonly}
  />
</div>

<dialog bind:this={descriptionDialog} aria-label={labels.descriptionTitle}>
  <div class="dialogContent">
    <h2 class="ws-h1">{labels.descriptionTitle}</h2>
    <textarea
      class="descriptionText ws-text"
      bind:value={description}
      readonly={readonly}
      aria-label={labels.descriptionTitle}
      rows="8"
    ></textarea>
    <button
      class="closeButton ws-text"
      type="button"
      onclick={() => descriptionDialog.close()}
      aria-label={labels.close}
    >
      {labels.close}
    </button>
  </div>
</dialog>

<style>
  .row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    gap: 10px;
    align-items: center;
  }

  .perkText {
    height: 28px;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.28);
    border-radius: 0;
    padding: 0 4px;
    background: transparent;
    min-width: 0;
  }

  .readonly {
    opacity: 0.9;
  }

  button {
    border: 1px solid rgba(0, 0, 0, 0.25);
    background: white;
    border-radius: 8px;
    padding: 8px 10px;
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

  .descriptionText {
    width: 100%;
    min-height: 160px;
    box-sizing: border-box;
    resize: vertical;
  }

  .closeButton {
    justify-self: end;
  }

  @media (max-width: 600px) {
    .row {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .perkText {
      grid-column: 1 / -1;
    }
  }
</style>
