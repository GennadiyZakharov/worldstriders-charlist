<script lang="ts">
  export let label: string = "";
  export let value: number = 0;
  export let max: number = 5;

  export let readonly: boolean = false;
  export let showValue: boolean = true;

  export let shape: "circle" | "square" = "circle";

  function clamp(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.min(max, Math.max(0, Math.trunc(n)));
  }

  $: value = clamp(value);
  $: max = Math.max(0, Math.trunc(max));

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
      value = 0;
    }
    if (e.key === "End") {
      e.preventDefault();
      value = max;
    }
  }
</script>

<div class="row">
  <div class="label">{label}</div>

  <div
    class="dots"
    role="slider"
    aria-label={label}
    aria-valuemin="0"
    aria-valuemax={max}
    aria-valuenow={value}
    tabindex={readonly ? undefined : 0}
    on:keydown={onKeyDown}
  >
    {#each Array(max) as _, idx (idx)}
      {@const i = idx + 1}
      <button
          type="button"
          class="dot"
          class:filled={i <= value}
          class:readonly={readonly}
          class:circle={shape === "circle"}
          class:square={shape === "square"}
          aria-label={`${label}: ${i}`}
          aria-pressed={i <= value}
          disabled={readonly}
          on:click={() => setByIndex(i)}
      />

    {/each}

    {#if showValue}
      <span class="num">{value}/{max}</span>
    {/if}
  </div>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 12px;
    background: rgba(255,255,255,0.6);
  }

  .label {
    font-weight: 600;
  }

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
