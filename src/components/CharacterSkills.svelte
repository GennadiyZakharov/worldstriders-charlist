<script lang="ts">
    import Skill from "./Skill.svelte";
    import type { CharacterSkills } from "../lib/types";

    type Props = {
        title: string;
        mentalTitle: string;
        mentalSub: string;
        physicalTitle: string;
        physicalSub: string;
        socialTitle: string;
        socialSub: string;
        labels: Record<string, string>;
        skills?: CharacterSkills;
        readonly?: boolean;
    };

    let {
        title,
        mentalTitle,
        mentalSub,
        physicalTitle,
        physicalSub,
        socialTitle,
        socialSub,
        labels,
        skills = $bindable<CharacterSkills>(),
        readonly = false
    }: Props = $props();
</script>

<section class="skills">
    <h1 class="ws-h1">{title}</h1>

    <div class="grid">
        <!-- Mental -->
        <div class="block">
            <div class="blockHeader">
                <h2 class="ws-h2">{mentalTitle}</h2>
                <div class="ws-text ws-muted">{mentalSub}</div>
            </div>

            <div class="list">
                {#each skills.mental as s, idx (s.id)}
                    <Skill
                            name={labels[s.id] ?? s.id}
                            bind:enabled={skills.mental[idx].line.enabled}
                            bind:note={skills.mental[idx].line.note}
                            bind:value={skills.mental[idx].line.rating}
                            {readonly}
                    />
                {/each}
            </div>
        </div>

        <!-- Physical -->
        <div class="block">
            <div class="blockHeader">
                <h2 class="ws-h2">{physicalTitle}</h2>
                <div class="ws-text ws-muted">{physicalSub}</div>
            </div>

            <div class="list">
                {#each skills.physical as s, idx (s.id)}
                    <Skill
                            name={labels[s.id] ?? s.id}
                            bind:enabled={skills.physical[idx].line.enabled}
                            bind:note={skills.physical[idx].line.note}
                            bind:value={skills.physical[idx].line.rating}
                            {readonly}
                    />
                {/each}
            </div>
        </div>

        <!-- Social -->
        <div class="block">
            <div class="blockHeader">
                <h2 class="ws-h2">{socialTitle}</h2>
                <div class="ws-text ws-muted">{socialSub}</div>
            </div>

            <div class="list">
                {#each skills.social as s, idx (s.id)}
                    <Skill
                            name={labels[s.id] ?? s.id}
                            bind:enabled={skills.social[idx].line.enabled}
                            bind:note={skills.social[idx].line.note}
                            bind:value={skills.social[idx].line.rating}
                            {readonly}
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
