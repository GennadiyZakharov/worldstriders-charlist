<script lang="ts">
    import Characteristic from "./Characteristic.svelte";
    import DotRating from "./DotRating.svelte";
    import type { CharacterCharacteristics, Character } from "../lib/types";

    let {
        title,
        labels,
        characteristics = $bindable<CharacterCharacteristics>(),
        character,
        readonly = false
    } = $props<{
        title: string;
        labels: {
            confidence: string;
            health: string;
            aura: string;
            soul: string;
            qi: string;
            willpower: string;
            charge: string;
        };

        characteristics?: CharacterCharacteristics;
        character?: Character;
        readonly?: boolean;
    }>();

    const clampInt = (n: number, min: number, max: number) =>
        Math.min(max, Math.max(min, Math.trunc(Number.isFinite(n) ? n : min)));

    const willpowerMax = $derived(character.attributes.determination + character.attributes.composure);
    const chargeMax = $derived(character.attributes.magic * 4);

    const athletics = $derived(character.skills.physical.find((x) => x.id === "athletics").line.rating);

    const size = 5;
    const defense = $derived(Math.min(characteristics.body.agility, character.attributes.quickWits) + athletics);
    const initiativeMod = $derived(character.attributes.bodyControl + character.attributes.composure);
    const speed = $derived(characteristics.body.strength + characteristics.body.agility + character.attributes.bodyControl * 2);
    const perception = $derived(character.attributes.quickWits + character.attributes.composure);

</script>

<section class="block">
    <h1 class="ws-h1">{title}</h1>

    <div class="layout">
        <!-- LEFT: main characteristics -->
        <div class="grid">
            <!-- Row 1 -->
            <Characteristic name={labels.confidence}
                            bind:dots={characteristics.confidence.dots}
                            bind:boxes={characteristics.confidence.boxes}
                            {readonly}
            />
            <Characteristic name={labels.health}
                            bind:dots={characteristics.health.dots}
                            bind:boxes={characteristics.health.boxes}
                            {readonly}
            />
            <Characteristic name={labels.aura}
                            bind:dots={characteristics.aura.dots}
                            bind:boxes={characteristics.aura.boxes}
                            {readonly}
            />
            <Characteristic name={labels.soul}
                            bind:dots={characteristics.soul.dots}
                            bind:boxes={characteristics.soul.boxes}
                            {readonly}
            />
            <Characteristic name={labels.qi}
                            bind:dots={characteristics.qi.dots}
                            bind:boxes={characteristics.qi.boxes}
                            {readonly}
            />

            <!-- Row 2 -->
            <div class="willpower">
                <Characteristic
                        name={labels.willpower}
                        bind:dots={characteristics.willpower.dots}
                        bind:boxes={characteristics.willpower.boxes}
                        max={willpowerMax}
                        {readonly}
                />
            </div>

            <div class="charge">
                <div class="ws-h2">{labels.charge}</div>
                <DotRating
                        bind:value={characteristics.charge}
                        min={0}
                        max={chargeMax}
                        shape="square"
                        showValue={false}
                        {readonly}
                />
            </div>
        </div>

        <!-- RIGHT: body panel (and future extensions) -->
        <div class="side">
            <aside class="bodyPanel">
                <div class="body">
                    <div class="ws-h2">{labels.body}</div>
                    <div class="bodyRow">
                        <div class="bodyName">{labels.strength}</div>
                        <DotRating
                                bind:value={characteristics.body.strength}
                                min={1}
                                max={5}
                                shape="circle"
                                showValue={false}
                                {readonly}
                        />
                    </div>

                    <div class="bodyRow">
                        <div class="bodyName">{labels.agility}</div>
                        <DotRating
                                bind:value={characteristics.body.agility}
                                min={1}
                                max={5}
                                shape="circle"
                                showValue={false}
                                {readonly}
                        />
                    </div>

                    <div class="bodyRow">
                        <div class="bodyName">{labels.endurance}</div>
                        <DotRating
                                bind:value={characteristics.body.endurance}
                                min={1}
                                max={5}
                                shape="circle"
                                showValue={false}
                                {readonly}
                        />
                    </div>
                </div>

                <!-- Extend here without changing layout -->
                <slot name="afterBody" />
            </aside>

            <aside class="derivedPanel" aria-label={labels.derivedTitle}>
                <div class="ws-h2">{labels.derivedTitle}</div>

                <div class="derivedList">
                    <div class="derivedRow">
                        <div class="derivedName">{labels.size}</div>
                        <div class="derivedVal">{size}</div>
                    </div>

                    <div class="derivedRow">
                        <div class="derivedName">{labels.defense}</div>
                        <div class="derivedVal">{defense}</div>
                    </div>

                    <div class="derivedRow">
                        <div class="derivedName">{labels.initiativeMod}</div>
                        <div class="derivedVal">{initiativeMod}</div>
                    </div>

                    <div class="derivedRow">
                        <div class="derivedName">{labels.speed}</div>
                        <div class="derivedVal">{speed}</div>
                    </div>

                    <div class="derivedRow">
                        <div class="derivedName">{labels.perception}</div>
                        <div class="derivedVal">{perception}</div>
                    </div>
                </div>

                <slot name="afterDerived" />
            </aside>
        </div>
    </div>
</section>


<style>
    .block {
        display: grid;
        gap: 12px;
    }

    /* Outer: left grid | right side */
    .layout {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 18px;
        align-items: start;
    }

    /* Left grid */
    .grid {
        display: grid;
        gap: 16px;
        align-items: start;
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    .willpower {
        grid-column: 1 / span 3;
        justify-self: center;
    }

    .charge {
        grid-column: 4 / span 2;
        display: grid;
        gap: 6px;
        justify-items: center;
    }

    /* Right side: body | derived */
    .side {
        display: grid;
        grid-template-columns: auto auto;
        gap: 18px;
        align-items: start;
    }

    /* Body panel */
    .bodyPanel {
        display: grid;
        gap: 12px;
        align-content: start;
        min-width: 220px;
    }

    .body {
        display: grid;
        gap: 8px;
        align-content: start;
    }

    .bodyRow {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px;
        align-items: center;
    }

    /* align dots to the right (stretchable gap is the 1fr column) */
    .bodyRow :global(.dots) {
        justify-self: end;
    }

    /* Prefer global typography; keep only layout-related styling */
    .bodyName {
        white-space: nowrap;
    }

    /* Derived panel */
    .derivedPanel {
        display: grid;
        gap: 10px;
        align-content: start;
        min-width: 160px;
    }

    .derivedList {
        display: grid;
        gap: 8px;
    }

    .derivedRow {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: baseline;
        gap: 10px;
    }

    /* dotted stretch line */
    .derivedRow::before {
        content: "";
        border-bottom: 1px dotted rgba(0, 0, 0, 0.25);
        transform: translateY(-2px);
    }

    .derivedName,
    .derivedVal {
        white-space: nowrap;
    }

    .derivedVal {
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    /* Mobile */
    @media (max-width: 900px) {
        .layout {
            grid-template-columns: 1fr;
        }

        .grid {
            grid-template-columns: 1fr;
        }

        .willpower,
        .charge {
            grid-column: auto;
            justify-self: stretch;
        }

        .side {
            grid-template-columns: 1fr;
        }

        .bodyPanel,
        .derivedPanel {
            min-width: 0;
        }

        .bodyRow :global(.dots) {
            justify-self: start;
        }
    }
</style>