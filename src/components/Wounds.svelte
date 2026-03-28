<script lang="ts">
    export type WoundMark = " " | "B" | "A" | "L";
    export type WoundsState = { marks: WoundMark[] };

    type Props = {
        caption: string;
        labels: {
            empty: string;
            cellLabel: string;
            aggravated: string;
            lethal: string;
            bashing: string;
        };
        wounds?: WoundsState;
        readonly?: boolean;
    };

    const OPTIONS: WoundMark[] = [" ", "B", "A", "L"];

    let {
        caption,
        labels,
        wounds = $bindable<WoundsState>({ marks: Array(10).fill(" ") as WoundMark[] }),
        readonly = false
    }: Props = $props();

    // Shape: 4,3,2,1 => 10 cells total
    const ROW_SIZES = [4, 3, 2, 1];
    const ROW_OFFSETS = [0, 4, 7, 9];
    const TOP_MARKS = ["0", "2", "4", "6", "8"];
    const COLUMN_MARKS = ["0", "-2", "-4", "-8"];

    function clampModel() {
        // Ensure correct length and allowed values
        const next = Array(10).fill(" ") as WoundMark[];
        const src = Array.isArray(wounds.marks) ? wounds.marks : [];
        for (let i = 0; i < 10; i++) {
            const v = src[i];
            next[i] = (v === " " || v === "B" || v === "A" || v === "L") ? v : " ";
        }
        // only replace if changed (keeps it idempotent)
        for (let i = 0; i < 10; i++) {
            if (wounds.marks?.[i] !== next[i]) {
                wounds.marks = next;
                return;
            }
        }
        if (!Array.isArray(wounds.marks) || wounds.marks.length !== 10) {
            wounds.marks = next;
        }
    }

    $effect(() => {
        clampModel();
    });

    function nextValue(v: WoundMark): WoundMark {
        const idx = OPTIONS.indexOf(v);
        return OPTIONS[(idx + 1) % OPTIONS.length];
    }

    function setAt(i: number, v: WoundMark) {
        if (readonly) return;
        const arr = wounds.marks.slice() as WoundMark[];
        arr[i] = v;
        wounds.marks = arr;
    }

    function cycleAt(i: number) {
        if (readonly) return;
        setAt(i, nextValue(wounds.marks[i] ?? " "));
    }

    function onKeyDown(i: number, e: KeyboardEvent) {
        if (readonly) return;

        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            cycleAt(i);
        }

        if (e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault();
            setAt(i, " ");
        }
    }

    function cellLabel(v: WoundMark): string {
        if (v === " ") return labels.empty;
        if (v === "B") return "B";
        if (v === "A") return "A";
        return "L";
    }
</script>

<section class="wounds">
    <div class="ws-h2">{caption}</div>

    <div class="tri" role="group" aria-label={caption}>
        <div class="marks marks-top ws-text ws-strong" aria-hidden="true">
            {#each TOP_MARKS as mark (mark)}
                <span>{mark}</span>
            {/each}
        </div>

        <div class="marks marks-columns ws-text" aria-hidden="true">
            {#each COLUMN_MARKS as mark, column (column)}
                <span style:grid-column={`${column + 1} / span 1`}>{mark}</span>
            {/each}
        </div>

        {#each ROW_SIZES as n, r}
            <div class="row">
                {#each Array(n) as _, c (c)}
                    {@const idx = ROW_OFFSETS[r] + c}
                    <button
                            type="button"
                            class="cell ws-text ws-strong"
                            style:grid-column={`${c + 1} / span 1`}
                            disabled={readonly}
                            aria-label={`${labels.cellLabel} ${idx + 1}: ${cellLabel(wounds.marks[idx] ?? " ")}`}
                            onkeydown={(e) => onKeyDown(idx, e)}
                            onclick={() => cycleAt(idx)}
                    >
                        {wounds.marks[idx] === " " ? "" : wounds.marks[idx]}
                    </button>
                {/each}
            </div>
        {/each}
    </div>

    <div class="legend ws-text">
        <div><span class="tag ws-strong">A</span> - {labels.aggravated}</div>
        <div><span class="tag ws-strong">L</span> - {labels.lethal}</div>
        <div><span class="tag ws-strong">B</span> - {labels.bashing}</div>
    </div>
</section>

<style>
    .wounds {
        display: grid;
        gap: 10px;
        align-content: start;
    }

    .tri {
        --cell-size: clamp(28px, 6vw, 32px);
        --cell-gap: clamp(6px, 1.6vw, 8px);
        --tri-width: calc((var(--cell-size) * 4) + (var(--cell-gap) * 3));
        display: grid;
        gap: 8px;
        justify-items: start;
        width: max-content;
    }

    .row {
        display: grid;
        grid-template-columns: repeat(4, var(--cell-size));
        gap: var(--cell-gap);
        width: var(--tri-width);
    }

    .marks {
        width: var(--tri-width);
        color: rgba(0, 0, 0, 0.75);
    }

    .marks-top {
        display: flex;
        justify-content: space-between;
        padding-bottom: 4px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.35);
    }

    .marks-columns {
        display: grid;
        grid-template-columns: repeat(4, var(--cell-size));
        gap: var(--cell-gap);
        padding-bottom: 4px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    }

    .marks-columns span {
        text-align: center;
    }

    .cell {
        width: var(--cell-size);
        height: var(--cell-size);
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-radius: 999px;
        background: transparent;
        cursor: pointer;
        display: grid;
        place-items: center;
        line-height: 1;
        user-select: none;
    }

    .cell:disabled {
        cursor: default;
        opacity: 0.7;
    }

    .cell:hover:not(:disabled),
    .cell:focus-visible {
        border-color: rgba(0, 0, 0, 0.5);
        outline: none;
    }

    .legend {
        display: grid;
        gap: 4px;
    }

    .tag {
        display: inline-block;
        min-width: 18px;
        text-align: center;
    }
</style>
