<script lang="ts">
  type Props = {
    header: string;
    value?: string;
    rows?: number;
  };

  let {
    header,
    value = $bindable(""),
    rows = 5
  }: Props = $props();
</script>

<section class="field">
  <h1 class="ws-h1">{header}</h1>
  <textarea class="ws-text" bind:value {rows} aria-label={header}></textarea>
</section>

<style>
  .field {
    display: grid;
    gap: 8px;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    min-height: 90px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.16);
    background: white;
    line-height: 1.35;
  }
</style>
