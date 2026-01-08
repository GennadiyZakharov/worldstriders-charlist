<script lang="ts">
  import DotRating from "./DotRating.svelte";

  /** Display name (already translated before passing in). */
  export let name: string;

  /** Attribute value. */
  export let value: number = 1;

  /** Optional: disable editing */
  export let readonly: boolean = false;

  function clamp15(n: number): number {
    if (!Number.isFinite(n)) return 1;
    const x = Math.trunc(n);
    return Math.min(5, Math.max(1, x));
  }

  $: value = clamp15(value);
</script>

<div class="attr">
  <div class="name">{name}</div>

  <DotRating
    bind:value
    min={1}
    max={5}
    shape="circle"
    showValue={false}
    {readonly}
  />
</div>

<style>
  .attr {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
    padding: 6px 0;
  }

  .name {
    font-size: 16px;
    font-weight: 700;
  }
</style>
