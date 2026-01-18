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

    <div class="grid">
        <!-- Row 1 -->
        <Characteristic
                name={labels.confidence}
                bind:dots={characteristics.confidence.dots}
                bind:boxes={characteristics.confidence.boxes}
                {readonly}
        />
        <Characteristic
                name={labels.health}
                bind:dots={characteristics.health.dots}
                bind:boxes={characteristics.health.boxes}
                {readonly}
        />
        <Characteristic
                name={labels.aura}
                bind:dots={characteristics.aura.dots}
                bind:boxes={characteristics.aura.boxes}
                {readonly}
        />
        <Characteristic
                name={labels.soul}
                bind:dots={characteristics.soul.dots}
                bind:boxes={characteristics.soul.boxes}
                {readonly}
        />
        <Characteristic
                name={labels.qi}
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
</section>

<style>
    .block {
        display: grid;
        gap: 12px;
    }

    .grid {
        display: grid;
        gap: 16px;
        align-items: start;

        /* 5 cards in the first row */
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    /* Second row layout */
    .willpower {
        grid-column: 1 / span 3; /* take 3/5 width */
        justify-self: center;
    }

    .charge {
        grid-column: 4 / span 2; /* take 2/5 width */
        display: grid;
        gap: 6px;
        justify-items: center;
    }

    @media (max-width: 900px) {
        .grid {
            grid-template-columns: 1fr;
        }

        .willpower,
        .charge {
            grid-column: auto;
            justify-self: stretch;
        }
    }
</style>
