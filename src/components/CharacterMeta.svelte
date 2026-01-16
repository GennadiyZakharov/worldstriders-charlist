<script lang="ts">
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
    } = $props<{
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
    }>();
</script>

<div class="metaGrid">

    <div class="col">
        <div class="row">
            <div class="label ws-strong">{labels.name}:</div>
            <input type="text" bind:value={name} />
        </div>

        <div class="row">
            <div class="label ws-strong">{labels.player}:</div>
            <input type="text" bind:value={player} />
        </div>

        <div class="row">
            <div class="label ws-strong">{labels.journey}:</div>
            <input type="text" bind:value={journey} />
        </div>
    </div>

    <div class="col">
        <div class="row">
            <div class="label ws-strong">{labels.bigKey}:</div>
            <input type="text" bind:value={bigKey} />
        </div>

        <div class="row">
            <div class="label ws-strong">{labels.smallKey}:</div>
            <input type="text" bind:value={smallKey} />
        </div>

        <div class="row">
            <div class="label ws-strong">{labels.vice}:</div>
            <input type="text" bind:value={vice} />
        </div>
    </div>

    <div class="col">
        <div class="row">
            <div class="label ws-strong">{labels.concept}:</div>
            <input type="text" bind:value={concept} />
        </div>

        <div class="row">
            <div class="label ws-strong">{labels.home}:</div>
            <input type="text" bind:value={home} />
        </div>

        <div class="row">
            <div class="label ws-strong">{labels.stratoc}:</div>
            <input type="text" bind:value={stratoc} />
        </div>
    </div>
</div>

<style>
    .metaGrid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 18px;
        align-items: start; /* IMPORTANT */
    }

    @media (max-width: 900px) {
        .metaGrid {
            grid-template-columns: 1fr;
        }
    }

    .col {
        display: grid;
        gap: 10px;
        align-content: start;
    }

    .row {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px;
        align-items: center;
    }

    .label {
        white-space: nowrap;
    }

    input {
        height: 18px;
        padding: 4px 6px;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.25);
        background: white;
        font-size: 12px;
    }
</style>