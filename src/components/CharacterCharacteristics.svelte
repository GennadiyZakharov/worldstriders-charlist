<script lang="ts">
    import Characteristic from "./Characteristic.svelte";
    import DotRating from "./DotRating.svelte";
    import type { CharacterCharacteristics, Character } from "../lib/types";

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
        characteristics: CharacterCharacteristics;
        character: Character;
        readonly?: boolean;
    };

    let {
        title,
        labels,
        characteristics = $bindable<CharacterCharacteristics>(),
        character,
        readonly = false
    }: Props = $props();

    const willpowerMax = $derived(character.attributes.determination + character.attributes.composure);
    const chargeMax = $derived(character.attributes.magic * 4);
</script>

<section class="block">
    <h1 class="ws-h1">{title}</h1>

    <div class="grid">
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

        <Characteristic
                name={labels.willpower}
                bind:dots={characteristics.willpower.dots}
                bind:boxes={characteristics.willpower.boxes}
                max={willpowerMax}
                {readonly}
        />

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
        min-width: 0;
    }

    .block > .ws-h1 {
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(145px, 100%), 1fr));
        gap: 16px;
        align-items: start;
    }

    .charge {
        display: grid;
        gap: 6px;
        justify-items: center;
    }
</style>
