<script lang="ts">
    import Perk from "./Perk.svelte";
    import type { PerkEntry } from "../lib/types";

    export let title: string;

    // Localized button labels
    export let labels: {
        add: string;
        delete: string;
    };

    // Bindable list
    export let perks: PerkEntry[] = [];

    export let readonly: boolean = false;

    function addPerk() {
        if (readonly) return;
        perks = [...perks, { text: "", level: 0 }];
    }

    function removePerk(idx: number) {
        if (readonly) return;
        perks = perks.filter((_, i) => i !== idx);
    }
</script>

<section class="perkList">
    <div class="header">
        <h1 class="ws-h1">{title}</h1>

        <button type="button" on:click={addPerk} disabled={readonly}>
            {labels.add}
        </button>
    </div>

    <div class="list">
        {#each perks as p, idx (idx)}
            <div class="row">
                <Perk
                        bind:text={perks[idx].text}
                        bind:level={perks[idx].level}
                        {readonly}
                />

                <button
                        type="button"
                        class="danger"
                        on:click={() => removePerk(idx)}
                        disabled={readonly}
                        aria-label={`${labels.delete} perk`}
                >
                    {labels.delete}
                </button>
            </div>
        {/each}
    </div>
</section>

<style>
    .perkList {
        display: grid;
        gap: 12px;
    }

    .header {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .list {
        display: grid;
        gap: 10px;
        align-content: start;
    }

    .row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        align-items: center;
    }

    button {
        border: 1px solid rgba(0, 0, 0, 0.25);
        background: white;
        border-radius: 8px;
        padding: 8px 10px;
        cursor: pointer;
        font-size: 13px;
        line-height: 1;
        user-select: none;
    }

    .danger {
        border-color: rgba(160, 0, 0, 0.35);
    }
</style>
