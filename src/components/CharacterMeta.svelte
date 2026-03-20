<script lang="ts">
    type Props = {
        labels: {
            name: string;
            player: string;
            journey: string;
            bigKey: string;
            smallKey: string;
            vice: string;
            concept: string;
            home: string;
            stratoc: string;
        };

        name: string;
        player: string;
        journey: string;

        bigKey: string;
        smallKey: string;
        vice: string;

        concept: string;
        home: string;
        stratoc: string;
    };

    let {
        labels,

        name = $bindable(""),
        player = $bindable(""),
        journey = $bindable(""),

        bigKey = $bindable(""),
        smallKey = $bindable(""),
        vice = $bindable(""),

        concept = $bindable(""),
        home = $bindable(""),
        stratoc = $bindable("")
    }: Props = $props();
</script>

<div class="metaGrid">
    <div class="col">
        <div class="label ws-strong">{labels.name}:</div>
        <input type="text" bind:value={name} />

        <div class="label ws-strong">{labels.player}:</div>
        <input type="text" bind:value={player} />

        <div class="label ws-strong">{labels.journey}:</div>
        <input type="text" bind:value={journey} />
    </div>

    <div class="col">
        <div class="label ws-strong">{labels.bigKey}:</div>
        <input type="text" bind:value={bigKey} />

        <div class="label ws-strong">{labels.smallKey}:</div>
        <input type="text" bind:value={smallKey} />

        <div class="label ws-strong">{labels.vice}:</div>
        <input type="text" bind:value={vice} />
    </div>

    <div class="col">
        <div class="label ws-strong">{labels.concept}:</div>
        <input type="text" bind:value={concept} />

        <div class="label ws-strong">{labels.home}:</div>
        <input type="text" bind:value={home} />

        <div class="label ws-strong">{labels.stratoc}:</div>
        <input type="text" bind:value={stratoc} />
    </div>
</div>

<style>
    .metaGrid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        align-items: start;
    }

    @media (max-width: 900px) {
        .metaGrid {
            grid-template-columns: 1fr;
        }
    }

    .col {
        display: grid;
        grid-template-columns: minmax(88px, max-content) minmax(0, 1fr);
        column-gap: 12px;
        row-gap: 10px;
        align-content: start;
        align-items: center;
    }

    .label {
        white-space: nowrap;
        min-width: 0;
    }

    input {
        width: 100%;
        min-width: 0;
        height: 18px;
        padding: 4px 6px;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.25);
        background: white;
        font-size: 12px;
        box-sizing: border-box;
    }
</style>
