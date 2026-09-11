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
        {#each TOP_MARKS as mark, column (mark)}
            <span
                    class="top-mark ws-text ws-strong"
                    style:grid-column={`${column + 1} / span 1`}
                    aria-hidden="true"
            >{mark}</span>
        {/each}

        <span class="separator separator-top" aria-hidden="true"></span>

        {#each COLUMN_MARKS as mark, column (column)}
            <span
                    class="column-mark ws-text"
                    style:grid-column={`${column + 1} / span 1`}
                    aria-hidden="true"
            >{mark}</span>
        {/each}

        <span class="separator separator-columns" aria-hidden="true"></span>

        {#each ROW_SIZES as n, r}
            {#each Array(n) as _, c (c)}
                {@const idx = ROW_OFFSETS[r] + c}
                <button
                        type="button"
                        class="cell ws-text ws-strong"
                        style:grid-column={`${c + 1} / span 1`}
                        style:grid-row={`${r + 5} / span 1`}
                        disabled={readonly}
                        aria-label={`${labels.cellLabel} ${idx + 1}: ${cellLabel(wounds.marks[idx] ?? " ")}`}
                        onkeydown={(e) => onKeyDown(idx, e)}
                        onclick={() => cycleAt(idx)}
                >
                    {wounds.marks[idx] === " " ? "" : wounds.marks[idx]}
                </button>
            {/each}
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
        --cell-size: clamp(22.4px, 4.8vw, 25.6px);
        --cell-gap: 2px;
        display: grid;
        grid-template-columns: repeat(5, var(--cell-size));
        grid-template-rows: auto 1px auto 1px repeat(4, var(--cell-size));
        gap: var(--cell-gap);
        justify-items: center;
        width: max-content;
    }

    .top-mark,
    .column-mark {
        color: rgba(0, 0, 0, 0.75);
        font-size: min(1em, calc(var(--cell-size) - 2px));
        text-align: center;
    }

    .top-mark {
        grid-row: 1;
    }

    .column-mark {
        grid-row: 3;
    }

    .separator {
        grid-column: 1 / -1;
        justify-self: stretch;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    }

    .separator-top {
        grid-row: 2;
        border-bottom-color: rgba(0, 0, 0, 0.35);
    }

    .separator-columns {
        grid-row: 4;
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
