<script lang="ts">
  type Props = {
    label?: string;
    value?: number;
    min?: number;
    max?: number;
    readonly?: boolean;
    showValue?: boolean;
    shape?: "circle" | "square";
  };

  let {
    label,
    value = $bindable(0),
    min = 0,
    max = 5,
    readonly = false,
    showValue = true,
    shape = "circle"
  }: Props = $props();

  function assertInteger(name: string, n: number) {
    if (!Number.isInteger(n)) throw new Error(`[Dots] ${name} must be an integer. Got: ${n}`);
  }

  function assertValid() {
    assertInteger("min", min);
    assertInteger("max", max);
    assertInteger("value", value);

    if (max <= 1) throw new Error(`[Dots] max must be > 1. Got: ${max}`);
    if (min < 0) throw new Error(`[Dots] min must be >= 0. Got: ${min}`);
    if (min >= max) throw new Error(`[Dots] min must be < max. Got min=${min}, max=${max}`);
  }

  function clamp(n: number): number {
    return Math.min(max, Math.max(min, n));
  }

  $effect(() => {
    assertValid();
    const nextValue = clamp(value);
    if (nextValue !== value) value = nextValue;
  });

  function setByIndex(i: number) {
    if (readonly) return;
    if (i === value) value = clamp(i - 1);
    else value = clamp(i);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (readonly) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      value = clamp(value - 1);
    }

    if (e.key === "ArrowRight") {
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
        onkeydown={onKeyDown}
>
  {#each Array(max) as _, idx (idx)}
    <button
            type="button"
            class="dot"
            class:filled={idx < value}
            class:readonly={readonly}
            class:circle={shape === "circle"}
            class:square={shape === "square"}
            aria-label={label ? `${label} ${idx + 1}/${max}` : `${idx + 1}/${max}`}
            aria-pressed={idx < value}
            disabled={readonly}
            onclick={() => setByIndex(idx + 1)}
    ></button>
  {/each}

  {#if showValue}
    <span class="num ws-text">{value}/{max}</span>
  {/if}
</div>

<style>
  .dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    user-select: none;
  }

  .dot {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(0, 0, 0, 0.35);
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  .dot.circle {
    border-radius: 999px;
  }

  .dot.square {
    border-radius: 1px;
  }

  .dot.filled {
    background: rgba(0, 0, 0, 0.65);
    border-color: rgba(0, 0, 0, 0.65);
  }

  .dot.readonly {
    cursor: default;
  }

  .num {
    opacity: 0.75;
    margin-left: 8px;
    min-width: 44px;
    text-align: right;
  }
</style>
