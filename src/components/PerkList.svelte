<script lang="ts">
    import Perk from "./Perk.svelte";
    import ItemList from "./ItemList.svelte";
    import type { PerkEntry } from "../lib/types";
    import { defaultPerk } from "../lib/model";

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
        perks?: PerkEntry[];
        readonly?: boolean;
    };

    let {
        title,
        labels,
        perks = $bindable<PerkEntry[]>([]),
        readonly = false
    }: Props = $props();

</script>

{#snippet renderPerk(perk: PerkEntry)}
    <Perk
        bind:text={perk.text}
        bind:description={perk.description}
        bind:level={perk.level}
        {labels}
        {readonly}
    />
{/snippet}

<ItemList
    {title}
    {labels}
    bind:items={perks}
    createItem={defaultPerk}
    renderItem={renderPerk}
    {readonly}
/>
