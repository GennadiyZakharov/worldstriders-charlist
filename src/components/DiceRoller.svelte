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
            options: string;
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
    const D10_DEFAULT_SUCCESS = 8;
    const MAX_DICE = 20;
    const MAX_CHAIN_ROLLS = 100;

    let diceCount = $state(4);
    let successThreshold = $state(D10_DEFAULT_SUCCESS);
    let rerollThreshold = $state(D10_MAX);
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
        rerollThreshold = clampInt(value, 2, D10_MAX, 10);
    }

    function rollD10(): number {
        return Math.floor(Math.random() * D10_MAX) + D10_MIN;
    }

    /**
     * Builds a chain of rolls for a single die.
     * If the rolled value is >= threshold, the die "explodes" and we roll again.
     */
    function buildChain(threshold: number): RollChain {
        const values: number[] = [];
        let total = 0;

        while (values.length < MAX_CHAIN_ROLLS) {
            const rolled = rollD10();
            values.push(rolled);
            total += rolled;

            // Stop if we didn't hit the reroll threshold
            if (rolled < threshold) {
                return { values, total };
            }
        }

        return { values, total };
    }

    function rollAll() {
        const safeDiceCount = clampInt(diceCount, 1, MAX_DICE, 1);
        const safeSuccessThreshold = clampInt(successThreshold, D10_MIN, D10_MAX, D10_DEFAULT_SUCCESS);
        // Ensure reroll threshold is at least 2 to avoid infinite loops
        const safeRerollThreshold = clampInt(rerollThreshold, 2, D10_MAX, D10_MAX);

        diceCount = safeDiceCount;
        successThreshold = safeSuccessThreshold;
        rerollThreshold = safeRerollThreshold;

        const chains = Array.from({ length: safeDiceCount }, () => buildChain(safeRerollThreshold));

        // Count successes: every die value >= successThreshold in every chain
        let successes = 0;
        for (const chain of chains) {
            for (const val of chain.values) {
                if (val >= safeSuccessThreshold) {
                    successes++;
                }
            }
        }

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
        <label class="field diceCountField">
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

        <div class="rollAction">
            <button type="button" class="rollButton ws-text" onclick={rollAll}>
                <span class="diceIcon" aria-hidden="true"></span>
                <span>{labels.roll}</span>
            </button>
        </div>

        <details class="optionsDisclosure">
            <summary class="optionsButton ws-text">{labels.options}</summary>
            <div class="optionsPanel">
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
                            min="2"
                            max={D10_MAX}
                            step="1"
                            inputmode="numeric"
                            bind:value={rerollThreshold}
                            aria-label={labels.rerollThreshold}
                            onblur={() => setRerollThreshold(rerollThreshold)}
                    />
                </label>
            </div>
        </details>
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
        justify-items: center;
        gap: 12px;
        width: min(100%, 30rem);
        margin-inline: auto;
    }

    .diceCountField {
        width: fit-content;
        justify-items: center;
    }

    .optionsDisclosure {
        width: min(100%, 28rem);
        min-width: 0;
    }

    .optionsButton {
        width: fit-content;
        min-height: 40px;
        margin-inline: auto;
        padding: 6px 14px;
        border: 1px solid rgba(0, 70, 95, 0.35);
        border-radius: 8px;
        background: rgba(0, 70, 95, 0.04);
        cursor: pointer;
        list-style: none;
        white-space: nowrap;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    .optionsButton::-webkit-details-marker {
        display: none;
    }

    .optionsButton:focus-visible,
    .rollButton:focus-visible {
        outline: 2px solid rgba(0, 70, 95, 0.8);
        outline-offset: 2px;
    }

    .optionsDisclosure[open] .optionsButton {
        background: rgba(0, 70, 95, 0.1);
    }

    .optionsPanel {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-items: stretch;
        gap: 16px 24px;
        margin-top: 12px;
    }

    .optionsPanel .field {
        align-content: end;
        justify-items: center;
        text-align: center;
    }

    .field {
        display: grid;
        gap: 6px;
        min-width: 0;
    }

    input {
        width: 5.5rem;
        max-width: 100%;
        min-width: 0;
        height: 32px;
        padding: 4px 8px;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.25);
        background: white;
        box-sizing: border-box;
    }

    .rollButton {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 40px;
        border: 1px solid rgba(0, 70, 95, 0.35);
        border-radius: 8px;
        background: rgba(0, 70, 95, 0.12);
        padding: 7px 22px;
        cursor: pointer;
        white-space: nowrap;
    }

    .rollButton:hover {
        background: rgba(0, 70, 95, 0.18);
    }

    .diceIcon {
        width: 16px;
        height: 16px;
        border: 1px solid currentColor;
        border-radius: 4px;
        background:
                radial-gradient(circle at 28% 28%, currentColor 0 1.5px, transparent 1.7px),
                radial-gradient(circle at 72% 28%, currentColor 0 1.5px, transparent 1.7px),
                radial-gradient(circle at 50% 50%, currentColor 0 1.5px, transparent 1.7px),
                radial-gradient(circle at 28% 72%, currentColor 0 1.5px, transparent 1.7px),
                radial-gradient(circle at 72% 72%, currentColor 0 1.5px, transparent 1.7px);
        box-sizing: border-box;
        flex: 0 0 auto;
    }

    .rollAction {
        display: flex;
        justify-content: center;
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
        overflow-wrap: anywhere;
    }

    .empty {
        min-height: 22px;
    }

    @media (max-width: 480px) {
        .optionsPanel {
            grid-template-columns: 1fr;
        }
    }
</style>
