<script lang="ts">
  import DotRating from "./DotRating.svelte";
  import Item from "./Item.svelte";

  type Props = {
    text?: string;
    description?: string;
    level?: number;
    labels: {
      text: string;
      description: string;
      descriptionTitle: string;
      close: string;
    };
    readonly?: boolean;
  };

  let {
    text = $bindable(""),
    description = $bindable(""),
    level = $bindable(0),
    labels,
    readonly = false
  }: Props = $props();

  function clamp05(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.min(5, Math.max(0, Math.trunc(value)));
  }

  $effect(() => {
    const clampedLevel = clamp05(level);
    if (clampedLevel !== level) level = clampedLevel;
  });
</script>

{#snippet rating()}
  <DotRating
    bind:value={level}
    min={0}
    max={5}
    shape="circle"
    showValue={false}
    {readonly}
  />
{/snippet}

<Item
  bind:text
  bind:description
  {labels}
  {readonly}
  trailingControls={rating}
/>
