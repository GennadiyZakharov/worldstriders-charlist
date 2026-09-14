<script lang="ts">
  import ItemList from "./ItemList.svelte";
  import SuperPower from "./SuperPower.svelte";
  import { defaultSuperPower } from "../lib/model";
  import type { SuperPowerEntry } from "../lib/types";

  type Props = {
    title: string;
    labels: {
      add: string;
      delete: string;
      deleteAction: string;
      origin: string;
      level: string;
      effect: string;
      attribute: string;
      skill: string;
    };
    superpowers?: SuperPowerEntry[];
    readonly?: boolean;
  };

  let {
    title,
    labels,
    superpowers = $bindable<SuperPowerEntry[]>([]),
    readonly = false
  }: Props = $props();
</script>

{#snippet renderSuperPower(superpower: SuperPowerEntry)}
  <SuperPower
    bind:origin={superpower.origin}
    bind:level={superpower.level}
    bind:effect={superpower.effect}
    bind:attribute={superpower.attribute}
    bind:skill={superpower.skill}
    {labels}
    {readonly}
  />
{/snippet}

<div class="superPowerList">
  <ItemList
    {title}
    {labels}
    bind:items={superpowers}
    createItem={defaultSuperPower}
    renderItem={renderSuperPower}
    {readonly}
  />
</div>

<style>
  .superPowerList :global(.listRow) {
    align-items: flex-end;
  }

  @media (max-width: 520px) {
    .superPowerList :global(.itemCell) {
      flex-basis: 100%;
      width: 100%;
    }

    .superPowerList :global(.danger) {
      align-self: flex-end;
    }
  }
</style>
