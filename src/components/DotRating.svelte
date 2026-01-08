<script lang="ts">
  export let value: number = 0;
  export let min: number = 0;
  export let max: number = 5;

  export let readonly: boolean = false;
  export let showValue: boolean = true;

  export let shape: "circle" | "square" = "circle";

  function clamp(n: number): number {
    return Math.min(max, Math.max(min, Math.trunc(n)));
  }

  $: min = Math.trunc(min);
  $: max = Math.trunc(max);
  $: value = clamp(value);

  function setByIndex(i: number) {
    if (readonly) return;
    if (i === value) value = clamp(i - 1);
    else value = clamp(i);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (readonly) return;

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      value = clamp(value - 1);
    }

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      value = clamp(value + 1);
    }

    if (e.key === "Home") {
      e.preventDefault();
      value = min;
    }

    if (e.key === "End") {
      e.preventDefault();
      value = max;
    }
  }
</script>

<div
  class="dots"
  role="slider"
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuenow={value}
  tabindex={readonly ? undefined : 0}
  on:keydown={onKeyDown}
>
  {#each Array(max) as _, idx (idx)}
    <button
      type="button"
      class="dot"
      class:filled={idx < value}
      class:readonly={readonly}
      class:circle={shape === "circle"}
      class:square={shape === "square"}
      aria-pressed={idx < value}
      disabled={readonly}
      on:click={() => setByIndex(idx+1)}
    />
  {/each}

  {#if showValue}
    <span class="num">{value}/{max}</span>
  {/if}
</div>

<style>
  .dots {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    user-select: none;
  }

  .dot {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(0,0,0,0.35);
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  .dot.circle {
    border-radius: 999px;
  }

  .dot.square {
    border-radius: 4px;
  }

  .dot.filled {
    background: rgba(0,0,0,0.65);
    border-color: rgba(0,0,0,0.65);
  }

  .dot.readonly {
    cursor: default;
  }

  .num {
    font-size: 12px;
    opacity: 0.75;
    margin-left: 8px;
    min-width: 44px;
    text-align: right;
  }
</style>
