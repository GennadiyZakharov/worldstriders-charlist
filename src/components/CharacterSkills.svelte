<script lang="ts">
    import Skill from "./Skill.svelte";
    import type { SkillEntry } from "../lib/types";

    export let title: string;

    export let mentalTitle: string;
    export let mentalSub: string;

    export let physicalTitle: string;
    export let physicalSub: string;

    export let socialTitle: string;
    export let socialSub: string;

    // Labels by skill id (already localized)
    export let labels: Record<string, string>;

    // Data (bindable arrays)
    export let mental: SkillEntry[];
    export let physical: SkillEntry[];
    export let social: SkillEntry[];
</script>

<section class="skills">
    <h1 class="ws-h1">{title}</h1>

    <div class="grid">
        <div class="block">
            <div class="blockHeader">
                <h2 class="ws-h2">{mentalTitle}</h2>
                <div class="ws-muted">{mentalSub}</div>
            </div>

            <div class="list">
                {#each mental as s, idx (s.id)}
                    <Skill
                            name={labels[s.id] ?? s.id}
                            bind:enabled={mental[idx].line.enabled}
                            bind:note={mental[idx].line.note}
                            bind:value={mental[idx].line.rating}
                    />
                {/each}
            </div>
        </div>

        <div class="block">
            <div class="blockHeader">
                <h2 class="ws-h2">{physicalTitle}</h2>
                <div class="ws-muted">{physicalSub}</div>
            </div>

            <div class="list">
                {#each physical as s, idx (s.id)}
                    <Skill
                            name={labels[s.id] ?? s.id}
                            bind:enabled={physical[idx].line.enabled}
                            bind:note={physical[idx].line.note}
                            bind:value={physical[idx].line.rating}
                    />
                {/each}
            </div>
        </div>

        <div class="block">
            <div class="blockHeader">
                <h2 class="ws-h2">{socialTitle}</h2>
                <div class="ws-muted">{socialSub}</div>
            </div>

            <div class="list">
                {#each social as s, idx (s.id)}
                    <Skill
                            name={labels[s.id] ?? s.id}
                            bind:enabled={social[idx].line.enabled}
                            bind:note={social[idx].line.note}
                            bind:value={social[idx].line.rating}
                    />
                {/each}
            </div>
        </div>
    </div>
</section>

<style>
    .skills {
        display: grid;
        gap: 12px;
    }

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        align-items: start;
    }

    @media (max-width: 900px) {
        .grid {
            grid-template-columns: 1fr;
        }
    }

    .block {
        display: grid;
        gap: 10px;
        align-content: start;
    }

    .blockHeader {
        display: grid;
        gap: 4px;
        justify-items: center;
    }

    .list {
        display: grid;
        gap: 10px;
        align-content: start;
    }
</style>
