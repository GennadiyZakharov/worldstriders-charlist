<script>
  export let label = "";
  export let value = 0;
  export let min = Number.NEGATIVE_INFINITY;
  export let max = Number.POSITIVE_INFINITY;
  export let step = 1;

  export let disabled = false;

  function clamp(n) {
    if (Number.isNaN(n)) return value;
    return Math.min(max, Math.max(min, n));
  }

  function dec() {
    value = clamp((Number(value) || 0) - step);
  }

  function inc() {
    value = clamp((Number(value) || 0) + step);
  }

  function onInput(e) {
    const n = Number(e.target.value);
    value = clamp(n);
  }
</script>

<div class="stat">
  <div class="label">{label}</div>

  <div class="control">
    <button type="button" on:click={dec} disabled={disabled || value <= min} aria-label="decrease">−</button>

    <input
      type="number"
      {min}
      {max}
      {step}
      {disabled}
      value={value}
      on:input={onInput}
    />

    <button type="button" on:click={inc} disabled={disabled || value >= max} aria-label="increase">+</button>
  </div>
</div>

<style>
  .stat {
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

  .control {
    display: grid;
    grid-auto-flow: column;
    gap: 6px;
    align-items: center;
  }

  button {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,0.16);
    background: white;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
  }

  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  input {
    width: 70px;
    height: 36px;
    padding: 6px 8px;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,0.16);
    background: white;
    font-size: 16px;
    text-align: center;
  }
</style>
