<script lang="ts" generics="T">
  import type { Snippet } from "svelte";

  type Props = {
    title: string;
    labels: {
      add: string;
      delete: string;
      deleteAction: string;
    };
    items?: T[];
    createItem: () => T;
    renderItem: Snippet<[T]>;
    readonly?: boolean;
  };

  let {
    title,
    labels,
    items = $bindable<T[]>([]),
    createItem,
    renderItem,
    readonly = false
  }: Props = $props();

  function addItem() {
    if (readonly) return;
    items = [...items, createItem()];
  }

  function removeItem(index: number) {
    if (readonly) return;
    items = items.filter((_, currentIndex) => currentIndex !== index);
  }
</script>

<section class="itemList">
  <div class="header">
    <h1 class="ws-h1">{title}</h1>

    <button class="ws-text" type="button" onclick={addItem} disabled={readonly}>
      {labels.add}
    </button>
  </div>

  <div class="list">
    {#each items as item, index (index)}
      <div class="listRow">
        <div class="itemCell">
          {@render renderItem(item)}
        </div>

        <button
          type="button"
          class="danger ws-text"
          onclick={() => removeItem(index)}
          disabled={readonly}
          aria-label={labels.deleteAction}
        >
          {labels.delete}
        </button>
      </div>
    {/each}
  </div>
</section>

<style>
  .itemList {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    min-width: 0;
  }

  .header {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    min-width: 0;
  }

  .header h1 {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .list {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    align-content: start;
    min-width: 0;
  }

  .listRow {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    min-width: 0;
  }

  .itemCell {
    flex: 1 1 220px;
    min-width: 0;
  }

  button {
    border: 1px solid rgba(0, 0, 0, 0.25);
    background: white;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    line-height: 1;
    user-select: none;
  }

  .danger {
    border-color: rgba(160, 0, 0, 0.35);
    margin-left: auto;
  }
</style>
