<script lang="ts">
  import DotRating from "./DotRating.svelte";

  /** Free text perk name/description */
  let { text = $bindable(""), level = $bindable(0), readonly = false } = $props<{
    text?: string;
    level?: number;
    readonly?: boolean;
  }>();

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

  <DotRating
    bind:value={level}
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
    grid-template-columns: 1fr auto;
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
    font-size: 13px;
    min-width: 0;
  }

  .readonly {
    opacity: 0.9;
  }
</style>
