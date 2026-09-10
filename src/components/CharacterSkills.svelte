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
        editorLabels: {
            specializations: string;
            specializationsShort: string;
            specializationsTitle: string;
            useSkill: string;
            close: string;
        };
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
        editorLabels,
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
                            labels={editorLabels}
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
                            labels={editorLabels}
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
                            labels={editorLabels}
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
        grid-template-columns: repeat(3, minmax(0, 330px));
        gap: 24px;
        align-items: start;
        justify-content: center;
    }

    .block {
        position: relative;
        display: grid;
        gap: 10px;
        align-content: start;
        min-width: 0;
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

    .block:not(:first-child)::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -12px;
        border-left: 1px solid rgba(0, 70, 95, 0.45);
    }

    @media (max-width: 1109px) {
        .grid {
            grid-template-columns: min(100%, 330px);
        }

        .block:not(:first-child)::before {
            top: -12px;
            right: 0;
            bottom: auto;
            left: 0;
            border-top: 1px solid rgba(0, 70, 95, 0.35);
            border-left: 0;
        }
    }
</style>
