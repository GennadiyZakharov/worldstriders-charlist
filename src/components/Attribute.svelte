<script lang="ts">
  import DotRating from "./DotRating.svelte";

  let {
    name,
    value = $bindable(1),
    readonly = false
  } = $props<{
    name: string;
    value?: number;
    readonly?: boolean;
  }>();

  function clamp1to5(n: number): number {
    return Math.min(5, Math.max(1, Math.trunc(n)));
  }

  // Keep value in [1..5] at all times
  $effect(() => {
    const v = clamp1to5(value);
    if (v !== value) value = v;
  });

</script>

<div class="attr">
  <div class="name">{name}</div>

  <DotRating
    bind:value
    min={1}
    max={5}
    shape="circle"
    showValue={false}
    readonly={readonly}
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
