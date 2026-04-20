<script lang="ts">
    type RollChain = {
        values: number[];
        total: number;
    };

    type RollResult = {
        chains: RollChain[];
        successes: number;
    };

    type Props = {
        labels: {
            title: string;
            diceCount: string;
            successThreshold: string;
            rerollThreshold: string;
            roll: string;
            empty: string;
            result: string;
            successSingular: string;
            successPlural: string;
        };
    };

    let { labels }: Props = $props();

    const D10_MIN = 1;
    const D10_MAX = 10;
    const MAX_DICE = 20;
    const MAX_CHAIN_ROLLS = 10;

    let diceCount = $state(4);
    let successThreshold = $state(8);
    let rerollThreshold = $state(10);
    let result = $state<RollResult | null>(null);

    function clampInt(value: number, min: number, max: number, fallback: number): number {
        if (!Number.isFinite(value)) return fallback;
        return Math.min(max, Math.max(min, Math.trunc(value)));
    }

    function setDiceCount(value: number) {
        diceCount = clampInt(value, 1, MAX_DICE, 1);
    }

    function setSuccessThreshold(value: number) {
        successThreshold = clampInt(value, D10_MIN, D10_MAX, 8);
    }

    function setRerollThreshold(value: number) {
        rerollThreshold = clampInt(value, D10_MIN, D10_MAX, 10);
    }

    function rollD10(): number {
        return Math.floor(Math.random() * D10_MAX) + D10_MIN;
    }

    function buildChain(threshold: number): RollChain {
        const values: number[] = [];
        let total = 0;

        while (values.length < MAX_CHAIN_ROLLS) {
            const rolled = rollD10();
            values.push(rolled);
            total += rolled;

            if (rolled < threshold) {
                return { values, total };
            }
        }

        return { values, total };
    }

    function rollAll() {
        const safeDiceCount = clampInt(diceCount, 1, MAX_DICE, 1);
        const safeSuccessThreshold = clampInt(successThreshold, D10_MIN, D10_MAX, 8);
        const safeRerollThreshold = clampInt(rerollThreshold, D10_MIN, D10_MAX, 10);

        diceCount = safeDiceCount;
        successThreshold = safeSuccessThreshold;
        rerollThreshold = safeRerollThreshold;

        const chains = Array.from({ length: safeDiceCount }, () => buildChain(safeRerollThreshold));
        const successes = chains.reduce((count, chain) => (
            count + chain.values.filter((value) => value >= safeSuccessThreshold).length
        ), 0);

        result = { chains, successes };
    }

    function formatChain(chain: RollChain): string {
        if (chain.values.length === 1) {
            return String(chain.values[0]);
        }

        return `${chain.total} [${chain.values.join(" ")}]`;
    }

    let formattedRolls = $derived(
        result ? `(${result.chains.map((chain) => formatChain(chain)).join(" ")})` : ""
    );

    let successText = $derived.by(() => {
        if (!result) return "";
        const label = result.successes === 1 ? labels.successSingular : labels.successPlural;
        return `(${result.successes} ${label})`;
    });
</script>

<section class="diceRoller">
    <h1 class="ws-h1">{labels.title}</h1>

    <div class="controls">
        <label class="field">
            <span class="ws-label">{labels.diceCount}</span>
            <input
                    class="ws-text"
                    type="number"
                    min="1"
                    max={MAX_DICE}
                    step="1"
                    inputmode="numeric"
                    bind:value={diceCount}
                    aria-label={labels.diceCount}
                    onblur={() => setDiceCount(diceCount)}
            />
        </label>

        <label class="field">
            <span class="ws-label">{labels.successThreshold}</span>
            <input
                    class="ws-text"
                    type="number"
                    min={D10_MIN}
                    max={D10_MAX}
                    step="1"
                    inputmode="numeric"
                    bind:value={successThreshold}
                    aria-label={labels.successThreshold}
                    onblur={() => setSuccessThreshold(successThreshold)}
            />
        </label>

        <label class="field">
            <span class="ws-label">{labels.rerollThreshold}</span>
            <input
                    class="ws-text"
                    type="number"
                    min={D10_MIN}
                    max={D10_MAX}
                    step="1"
                    inputmode="numeric"
                    bind:value={rerollThreshold}
                    aria-label={labels.rerollThreshold}
                    onblur={() => setRerollThreshold(rerollThreshold)}
            />
        </label>

        <button type="button" class="rollButton ws-text" onclick={rollAll}>
            {labels.roll}
        </button>
    </div>

    <div class="resultBlock">
        <div class="ws-label">{labels.result}</div>

        {#if result}
            <div class="resultLine ws-text" aria-live="polite">
                <span>{formattedRolls}</span>
                <span>{successText}</span>
            </div>
        {:else}
            <div class="empty ws-muted ws-text">{labels.empty}</div>
        {/if}
    </div>
</section>

<style>
    .diceRoller {
        display: grid;
        gap: 14px;
    }

    .controls {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
        gap: 12px;
        align-items: end;
    }

    .field {
        display: grid;
        gap: 6px;
        min-width: 0;
    }

    input {
        width: 100%;
        min-width: 0;
        height: 32px;
        padding: 4px 8px;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.25);
        background: white;
        box-sizing: border-box;
    }

    .rollButton {
        height: 32px;
        border: 1px solid rgba(0, 70, 95, 0.35);
        border-radius: 8px;
        background: rgba(0, 70, 95, 0.08);
        padding: 0 14px;
        cursor: pointer;
        white-space: nowrap;
    }

    .resultBlock {
        display: grid;
        gap: 6px;
        padding: 12px;
        border-radius: 8px;
        background: rgba(0, 70, 95, 0.05);
    }

    .resultLine {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        line-height: 1.4;
        word-break: break-word;
    }

    .empty {
        min-height: 22px;
    }

    @media (max-width: 900px) {
        .controls {
            grid-template-columns: 1fr;
        }
    }
</style>
