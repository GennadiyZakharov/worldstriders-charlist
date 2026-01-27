<script lang="ts">
    export type WoundMark = " " | "B" | "A" | "L";
    export type WoundsState = { marks: WoundMark[] };

    type Props = {
        caption: string;
        wounds?: WoundsState;
        readonly?: boolean;
    };

    const OPTIONS: WoundMark[] = [" ", "B", "A", "L"];

    let {
        caption,
        wounds = $bindable<WoundsState>({ marks: Array(10).fill(" ") as WoundMark[] }),
        readonly = false
    } = $props<Props>();

    // Shape: 4,3,2,1 => 10 cells total
    const ROW_SIZES = [4, 3, 2, 1];

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
        if (v === " ") return "Empty";
        if (v === "B") return "B";
        if (v === "A") return "A";
        return "L";
    }
</script>

<section class="wounds">
    <div class="ws-h2">{caption}</div>

    <div class="tri" role="group" aria-label={caption}>
        {#each ROW_SIZES as n, r}
            <div class="row">
                {#each Array(n) as _, c (c)}
                    {@const idx = (r === 0 ? 0 : r === 1 ? 4 : r === 2 ? 7 : 9) + c}
                    <button
                            type="button"
                            class="cell ws-text"
                            disabled={readonly}
                            aria-label={`Wound ${idx + 1}: ${cellLabel(wounds.marks[idx] ?? " ")}`}
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
        <div><span class="tag">A</span> — Aggravated</div>
        <div><span class="tag">L</span> — Lethal</div>
        <div><span class="tag">B</span> — Bashing</div>
    </div>
</section>

<style>
    .wounds {
        display: grid;
        gap: 10px;
        align-content: start;
    }

    .tri {
        display: grid;
        gap: 6px;
        justify-items: start;
    }

    .row {
        display: grid;
        gap: 6px;
        grid-auto-flow: column;
        justify-content: start;
    }

    /* center the triangle by adding left padding per row */
    .row:nth-child(1) { padding-left: 0px; }
    .row:nth-child(2) { padding-left: 14px; }
    .row:nth-child(3) { padding-left: 28px; }
    .row:nth-child(4) { padding-left: 42px; }

    .cell {
        width: 28px;
        height: 28px;
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-radius: 999px;
        background: transparent;
        cursor: pointer;
        display: grid;
        place-items: center;
        font-weight: 800;
        line-height: 1;
        user-select: none;
    }

    .cell:disabled {
        cursor: default;
        opacity: 0.7;
    }

    .legend {
        display: grid;
        gap: 4px;
    }

    .tag {
        display: inline-block;
        min-width: 18px;
        text-align: center;
        font-weight: 800;
    }
</style>
