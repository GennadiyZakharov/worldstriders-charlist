<script lang="ts">
    import Characteristic from "./Characteristic.svelte";
    import DotRating from "./DotRating.svelte";
    import type { CharacterCharacteristics } from "../lib/types";

    type Props = {
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

        // derived limits depend on attributes
        determination: number;
        composure: number;
        magic: number;

        characteristics?: CharacterCharacteristics;
        readonly?: boolean;
    };

    let {
        title,
        labels,
        determination,
        composure,
        magic,
        characteristics = $bindable<CharacterCharacteristics>(),
        readonly = false
    } = $props<Props>();

    const clampInt = (n: number, min: number, max: number) =>
        Math.min(max, Math.max(min, Math.trunc(Number.isFinite(n) ? n : min)));

    const willpowerMax = $derived(determination + composure);
    const chargeMax = $derived(magic * 4);

    // Safety clamping (idempotent)
    $effect(() => {
        const wpMax = willpowerMax;
        const chMax = chargeMax;

        const wpDots = clampInt(characteristics.willpower.dots, 0, wpMax);
        if (wpDots !== characteristics.willpower.dots) {
            characteristics.willpower.dots = wpDots;
        }

        const wpBoxes = clampInt(characteristics.willpower.boxes, 0, wpMax);
        if (wpBoxes !== characteristics.willpower.boxes) {
            characteristics.willpower.boxes = wpBoxes;
        }

        const ch = clampInt(characteristics.charge, 0, chMax);
        if (ch !== characteristics.charge) {
            characteristics.charge = ch;
        }
    });
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
                        label={labels.charge}
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
        <aside class="bodyPanel">
            <div class="body">
                <div class="ws-h2">Временные параметры</div>
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
    </div>
</section>


<style>
    .block {
        display: grid;
        gap: 12px;
    }

    /* 2-column overall layout: main grid | body panel */
    .layout {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 18px;
        align-items: start;
    }

    /* LEFT grid (same idea as before) */
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

    /* RIGHT panel */
    .bodyPanel {
        display: grid;
        gap: 12px; /* space between body and anything in afterBody slot */
        align-content: start;
        min-width: 220px; /* optional: gives dots room; tweak as needed */
    }

    .body {
        display: grid;
        gap: 8px;
        align-content: start;
    }

    /* label ----stretch---- dots (dots aligned right) */
    .bodyRow {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px;
        align-items: center;
    }

    .bodyRow :global(.dots) {
        justify-self: end;
    }

    .bodyName {
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
    }

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

        .bodyPanel {
            min-width: 0;
        }

        .bodyRow :global(.dots) {
            justify-self: start; /* optional: on mobile left-align feels better */
        }
    }
</style>
