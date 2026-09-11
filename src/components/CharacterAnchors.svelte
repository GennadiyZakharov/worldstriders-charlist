<script lang="ts">
  import Item from "./Item.svelte";
  import ItemList from "./ItemList.svelte";
  import type { ItemEntry } from "../lib/types";
  import { defaultItem } from "../lib/model";

  type Props = {
    title: string;
    labels: {
      add: string;
      delete: string;
      deleteAction: string;
      text: string;
      description: string;
      descriptionTitle: string;
      close: string;
    };
    anchors?: ItemEntry[];
    readonly?: boolean;
  };

  let {
    title,
    labels,
    anchors = $bindable<ItemEntry[]>([]),
    readonly = false
  }: Props = $props();
</script>

{#snippet renderAnchor(anchor: ItemEntry)}
  <Item
    bind:text={anchor.text}
    bind:description={anchor.description}
    {labels}
    {readonly}
  />
{/snippet}

<ItemList
  {title}
  {labels}
  bind:items={anchors}
  createItem={defaultItem}
  renderItem={renderAnchor}
  {readonly}
/>
