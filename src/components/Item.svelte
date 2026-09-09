<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    text?: string;
    description?: string;
    labels: {
      text: string;
      description: string;
      descriptionTitle: string;
      close: string;
    };
    readonly?: boolean;
    trailingControls?: Snippet;
  };

  let {
    text = $bindable(""),
    description = $bindable(""),
    labels,
    readonly = false,
    trailingControls
  }: Props = $props();

  let descriptionDialog: HTMLDialogElement;

  function openDescription() {
    descriptionDialog.showModal();
  }

  function onBlurText() {
    const trimmedText = text.trim();
    if (trimmedText !== text) text = trimmedText;
  }
</script>

<div class="itemRow" class:readonly class:hasTrailingControls={trailingControls !== undefined}>
  <input
    class="itemText ws-text"
    type="text"
    bind:value={text}
    disabled={readonly}
    aria-label={labels.text}
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

  {#if trailingControls}
    {@render trailingControls()}
  {/if}
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
  .itemRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    align-items: center;
  }

  .itemRow.hasTrailingControls {
    grid-template-columns: minmax(0, 1fr) auto auto;
  }

  .itemText {
    box-sizing: border-box;
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
    .itemRow.hasTrailingControls {
      display: flex;
      flex-wrap: wrap;
    }

    .itemRow.hasTrailingControls .itemText {
      flex: 1 0 100%;
    }
  }
</style>
