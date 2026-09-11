<script lang="ts">
    import DotRating from "./DotRating.svelte";
    import type { Character, CharacterCharacteristics } from "../lib/types";

    type Body = CharacterCharacteristics["body"];

    type Props = {
        labels: {
            body: string;
            strength: string;
            agility: string;
            endurance: string;
            derivedTitle: string;
            size: string;
            defense: string;
            initiativeMod: string;
            speed: string;
            perception: string;
        };
        body: Body;
        character: Character;
        readonly?: boolean;
    };

    let {
        labels,
        body = $bindable<Body>(),
        character,
        readonly = false
    }: Props = $props();

    const athleticsSkill = $derived(character.skills.physical.find((skill) => skill.id === "athletics"));
    const athletics = $derived(athleticsSkill?.line.rating ?? 0);

    const size = 5;
    const defense = $derived(Math.min(body.agility, character.attributes.quickWits) + athletics);
    const initiativeMod = $derived(character.attributes.bodyControl + character.attributes.composure);
    const speed = $derived(body.strength + body.agility + character.attributes.bodyControl * 2);
    const perception = $derived(character.attributes.quickWits + character.attributes.composure);
</script>

<section class="bodyCharacteristics">
    <div class="bodyPanel">
        <h2 class="ws-h2">{labels.body}</h2>

        <div class="bodyList">
            <div class="bodyRow">
                <div class="bodyName ws-label">{labels.strength}</div>
                <DotRating
                        label={labels.strength}
                        bind:value={body.strength}
                        min={1}
                        max={5}
                        shape="circle"
                        showValue={false}
                        {readonly}
                />
            </div>

            <div class="bodyRow">
                <div class="bodyName ws-label">{labels.agility}</div>
                <DotRating
                        label={labels.agility}
                        bind:value={body.agility}
                        min={1}
                        max={5}
                        shape="circle"
                        showValue={false}
                        {readonly}
                />
            </div>

            <div class="bodyRow">
                <div class="bodyName ws-label">{labels.endurance}</div>
                <DotRating
                        label={labels.endurance}
                        bind:value={body.endurance}
                        min={1}
                        max={5}
                        shape="circle"
                        showValue={false}
                        {readonly}
                />
            </div>
        </div>
    </div>

    <div class="derivedPanel" aria-label={labels.derivedTitle}>
        <h2 class="ws-h2">{labels.derivedTitle}</h2>

        <div class="derivedList">
            <div class="derivedRow">
                <div class="derivedName ws-label">{labels.size}</div>
                <span class="leader" aria-hidden="true"></span>
                <div class="derivedVal ws-text">{size}</div>
            </div>

            <div class="derivedRow">
                <div class="derivedName ws-label">{labels.defense}</div>
                <span class="leader" aria-hidden="true"></span>
                <div class="derivedVal ws-text">{defense}</div>
            </div>

            <div class="derivedRow">
                <div class="derivedName ws-label">{labels.initiativeMod}</div>
                <span class="leader" aria-hidden="true"></span>
                <div class="derivedVal ws-text">{initiativeMod}</div>
            </div>

            <div class="derivedRow">
                <div class="derivedName ws-label">{labels.speed}</div>
                <span class="leader" aria-hidden="true"></span>
                <div class="derivedVal ws-text">{speed}</div>
            </div>

            <div class="derivedRow">
                <div class="derivedName ws-label">{labels.perception}</div>
                <span class="leader" aria-hidden="true"></span>
                <div class="derivedVal ws-text">{perception}</div>
            </div>
        </div>
    </div>
</section>

<style>
    .bodyCharacteristics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(210px, 100%), 1fr));
        gap: 18px;
        align-items: start;
        min-width: 0;
    }

    .bodyPanel,
    .derivedPanel,
    .bodyList,
    .derivedList {
        display: grid;
        align-content: start;
        min-width: 0;
    }

    .bodyPanel,
    .derivedPanel {
        gap: 10px;
    }

    .bodyList,
    .derivedList {
        gap: 8px;
    }

    .bodyRow {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
        align-items: center;
        min-width: 0;
    }

    .bodyName,
    .derivedName {
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .bodyRow :global(.dots) {
        justify-self: end;
    }

    .derivedRow {
        display: grid;
        grid-template-columns: auto minmax(12px, 1fr) auto;
        align-items: baseline;
        gap: 10px;
        min-width: 0;
    }

    .leader {
        border-bottom: 1px dotted rgba(0, 0, 0, 0.25);
        transform: translateY(-2px);
    }

    .derivedVal {
        text-align: right;
        font-variant-numeric: tabular-nums;
    }
</style>
