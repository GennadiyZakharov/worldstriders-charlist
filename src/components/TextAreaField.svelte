<script>
  export let label = "";
  export let value = "";
  export let rows = 5;
  export let placeholder = "";
</script>

<label class="field">
  <div class="label">{label}</div>
  <textarea bind:value {rows} {placeholder}></textarea>
</label>

<style>
  .field {
    display: grid;
    gap: 8px;
  }

  .label {
    font-weight: 600;
  }

  textarea {
    width: 100%;
    resize: vertical;
    min-height: 90px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.16);
    background: white;
    font-size: 14px;
    line-height: 1.35;
  }
</style>
