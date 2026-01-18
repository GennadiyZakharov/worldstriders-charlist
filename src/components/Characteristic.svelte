<script lang="ts">
    import DotRating from "./DotRating.svelte";

    let {
        name,
        dots = $bindable(0),
        boxes = $bindable(0),
        max = 5,
        readonly = false
    } = $props<{
        name: string;
        dots?: number;
        boxes?: number;
        max?: number;
        readonly?: boolean;
    }>();

    const clampInt = (n: number, lo: number, hi: number) =>
        Math.min(hi, Math.max(lo, Math.trunc(n)));

    // DotRating requires:
    // - min >= 0 (we use 0)
    // - max > 1
    // - integer values
    $effect(() => {
        const nextMax = clampInt(max, 2, 20); // pick any reasonable upper bound you like
        if (nextMax !== max) max = nextMax;

        const nextDots = clampInt(dots, 0, max);
        if (nextDots !== dots) dots = nextDots;

        const nextBoxes = clampInt(boxes, 0, max);
        if (nextBoxes !== boxes) boxes = nextBoxes;
    });
</script>

<div class="char">
    <div class="title ws-h2">{name}</div>

    <div class="ratings">
        <DotRating
                label={`${name} dots`}
                bind:value={dots}
                min={0}
                max={max}
                shape="circle"
                showValue={false}
                {readonly}
        />

        <DotRating
                label={`${name} boxes`}
                bind:value={boxes}
                min={0}
                max={max}
                shape="square"
                showValue={false}
                {readonly}
        />
    </div>
</div>

<style>
    .char {
        display: grid;
        gap: 6px;
        justify-items: center;
    }

    .title {
        text-align: center;
    }

    .ratings {
        display: grid;
        gap: 6px;
        justify-items: center;
    }
</style>
