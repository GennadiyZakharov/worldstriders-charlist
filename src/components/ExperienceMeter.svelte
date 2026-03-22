<script lang="ts">
    import DotRating from "./DotRating.svelte";
    import type { ExperienceState } from "../lib/types"; // adjust path

    type Props = {
        caption: string;
        labels: {
            total: string;
            spent: string;
            milestones: string;
            addMilestones: string;
            milestonesHint: string;
            addMilestonesPrompt: string;
        };
        experience?: ExperienceState;
        readonly?: boolean;
    };

    let {
        caption,
        labels,
        experience = $bindable<ExperienceState>(),
        readonly = false
    }: Props = $props();

    const clampInt = (n: number, min: number, max: number) =>
        Math.min(max, Math.max(min, Math.trunc(Number.isFinite(n) ? n : min)));

    function setTotal(v: number) {
        const total = clampInt(v, 0, 999999);
        if (total !== experience.total) experience.total = total;

        // enforce spent <= total
        if (experience.spent > total) experience.spent = total;
    }

    function setSpent(v: number) {
        const spent = clampInt(v, 0, experience.total);
        if (spent !== experience.spent) experience.spent = spent;
    }

    function setMilestones(v: number) {
        // milestones are remainder 0..4
        const m = clampInt(v, 0, 4);
        if (m !== experience.milestones) experience.milestones = m;
    }

    // Safety clamp if parent loads weird data
    $effect(() => {
        const total = clampInt(experience.total, 0, 999999);
        if (total !== experience.total) experience.total = total;

        const spent = clampInt(experience.spent, 0, total);
        if (spent !== experience.spent) experience.spent = spent;

        const m = clampInt(experience.milestones, 0, 4);
        if (m !== experience.milestones) experience.milestones = m;
    });

    function promptAddMilestones() {
        if (readonly) return;

        const raw = window.prompt(labels.addMilestonesPrompt, "1");
        if (raw === null) return;

        const add = Math.trunc(Number(raw));
        if (!Number.isFinite(add) || add <= 0) return;

        const totalMilestones = experience.milestones + add;
        const gainedXp = Math.floor(totalMilestones / 5);
        const remainder = totalMilestones % 5;

        if (gainedXp > 0) setTotal(experience.total + gainedXp);
        setMilestones(remainder);
    }

    function incTotal(d: number) {
        if (readonly) return;
        setTotal(experience.total + d);
    }

    function incSpent(d: number) {
        if (readonly) return;
        setSpent(experience.spent + d);
    }
</script>

<section class="xp">
    <div class="ws-h2">{caption}</div>

    <div class="fields">
        <div class="numRow">
            <div class="fieldLabel numLabel ws-text">{labels.total}</div>

            <input
                    class="numInput ws-text"
                    type="number"
                    inputmode="numeric"
                    min="0"
                    step="1"
                    max="1000"
                    value={experience.total}
                    disabled={readonly}
                    aria-label={labels.total}
                    oninput={(e) => {
                      const target = e.target;
                      if (target instanceof HTMLInputElement) {
                        setTotal(
                          Number.isFinite(target.valueAsNumber)
                            ? target.valueAsNumber
                            : 0
                        );
                      }
                    }}
                    onblur={() => setTotal(experience.total)}
            />
        </div>

        <div class="numRow">
            <div class="fieldLabel numLabel ws-text">{labels.spent}</div>

            <input
                    class="numInput ws-text"
                    type="number"
                    inputmode="numeric"
                    min="0"
                    step="1"
                    max={experience.total}
                    value={experience.spent}
                    disabled={readonly}
                    aria-label={labels.spent}
                    oninput={(e) => {
                      const target = e.target;
                      if (target instanceof HTMLInputElement) {
                        setSpent(
                          Number.isFinite(target.valueAsNumber)
                            ? target.valueAsNumber
                            : 0
                        );
                      }
                    }}
                    onblur={() => setSpent(experience.spent)}
            />
        </div>

        <div class="msRow">
            <div class="fieldLabel msLabel ws-text">{labels.milestones}</div>

            <div class="msRight">
                <DotRating
                        bind:value={experience.milestones}
                        min={0}
                        max={4}
                        shape="circle"
                        showValue={false}
                        readonly={readonly}
                />

                <button type="button" class="btnWide ws-text" onclick={promptAddMilestones} disabled={readonly}>
                    {labels.addMilestones}
                </button>
            </div>
        </div>

        <div class="hint ws-muted">
            {labels.milestonesHint}
        </div>
    </div>
</section>

<style>
    .xp {
        display: grid;
        gap: 10px;
        align-content: start;
        height: 100%;
    }

    .fields {
        display: grid;
        gap: 10px;
        grid-template-columns: minmax(0, 110px) minmax(88px, 1fr);
        align-items: start;
    }

    .numRow {
        display: contents;
    }

    .fieldLabel {
        min-height: 28px;
        display: flex;
        align-items: center;
    }

    .numLabel {
        white-space: nowrap;
    }

    .numInput {
        width: 100%;
        min-width: 0;
        height: 28px;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.28);
        border-radius: 0;
        padding: 0 6px;
        background: transparent;
    }

    .msRow {
        display: contents;
    }

    .msLabel {
        white-space: nowrap;
    }

    .msRight {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(116px, max-content);
        gap: 10px;
        align-items: center;
        min-width: 0;
    }

    .msRight :global(.dots) {
        justify-self: end;
        min-width: 0;
    }

    .btnWide {
        width: 100%;
        min-height: 32px;
        border: 1px solid rgba(0, 0, 0, 0.25);
        background: white;
        border-radius: 8px;
        padding: 8px 10px;
        line-height: 1;
        cursor: pointer;
        box-sizing: border-box;
    }

    .btnWide:disabled {
        cursor: default;
        opacity: 0.6;
    }

    .hint {
        grid-column: 1 / -1;
        margin-top: -2px;
        padding-left: 122px;
    }

    @media (max-width: 520px) {
        .fields {
            grid-template-columns: 1fr;
        }

        .fieldLabel {
            min-height: auto;
        }

        .msRight {
            grid-template-columns: 1fr;
            justify-items: stretch;
        }

        .msRight :global(.dots) {
            justify-self: start;
        }

        .hint {
            padding-left: 0;
            margin-top: 0;
        }
    }
</style>
