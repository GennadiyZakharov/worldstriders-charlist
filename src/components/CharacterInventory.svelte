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
    inventory?: ItemEntry[];
    readonly?: boolean;
  };

  let {
    title,
    labels,
    inventory = $bindable<ItemEntry[]>([]),
    readonly = false
  }: Props = $props();
</script>

{#snippet renderInventoryItem(item: ItemEntry)}
  <Item
    bind:text={item.text}
    bind:description={item.description}
    {labels}
    {readonly}
  />
{/snippet}

<ItemList
  {title}
  {labels}
  bind:items={inventory}
  createItem={defaultItem}
  renderItem={renderInventoryItem}
  {readonly}
/>
