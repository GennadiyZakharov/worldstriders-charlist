<script lang="ts">
  import DotRating from "./DotRating.svelte";

  /** Free text perk name/description */
  export let text: string = "";

  /** Perk level: 0..5 */
  export let level: number = 0;

  /** Optional: disable editing */
  export let readonly: boolean = false;

  function clamp05(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.min(5, Math.max(0, Math.trunc(n)));
  }

  $: level = clamp05(level);
</script>

<div class="row" class:readonly>
  <input
    class="perkText ws-text"
    type="text"
    bind:value={text}
    disabled={readonly}
    placeholder=""
    aria-label="Perk text"
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
  }

  .readonly {
    opacity: 0.9;
  }
</style>
