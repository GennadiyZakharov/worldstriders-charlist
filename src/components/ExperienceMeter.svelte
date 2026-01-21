<script lang="ts">
    import DotRating from "./DotRating.svelte";
    import type { ExperienceState } from "../lib/types"; // adjust path

    let {
        caption,
        experience = $bindable<ExperienceState>(),
        readonly = false
    } = $props<{
        caption: string;
        experience?: ExperienceState;
        readonly?: boolean;
    }>();

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

        const raw = window.prompt("How many milestones to add?", "1");
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

    <div class="numbers">
        <div class="numRow">
            <div class="numLabel ws-text">Total experience</div>

            <div class="numControl">
                <input
                        class="numInput ws-text"
                        type="number"
                        inputmode="numeric"
                        min="0"
                        step="1"
                        max="1000"
                        value={experience.total}
                        disabled={readonly}
                        aria-label="Total experience"
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
        </div>

        <div class="numRow">
            <div class="numLabel ws-text">Spent experience</div>

            <div class="numControl">
                <input
                        class="numInput ws-text"
                        type="number"
                        inputmode="numeric"
                        min="0"
                        step="1"
                        max={experience.total}
                        value={experience.spent}
                        disabled={readonly}
                        aria-label="Spent experience"
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
        </div>
    </div>

    <div class="milestones">
        <div class="msRow">
            <div class="msLabel ws-text">Milestones</div>

            <div class="msRight">
                <DotRating
                        bind:value={experience.milestones}
                        min={0}
                        max={4}
                        shape="circle"
                        showValue={false}
                        readonly={readonly}
                />

                <button type="button" class="btnWide" onclick={promptAddMilestones} disabled={readonly}>
                    Add milestones
                </button>
            </div>
        </div>

        <div class="ws-muted hint">
            Every 5 milestones = +1 total experience
        </div>
    </div>
</section>

<style>
    .xp {
        display: grid;
        gap: 10px;
        align-content: start;
    }

    .numbers {
        display: grid;
        gap: 10px;
    }

    .numRow {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 12px;
        align-items: center;
    }

    .numLabel {
        white-space: nowrap;
    }

    .numControl {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 8px;
        align-items: center;
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
        font-size: 13px;
    }

    .milestones {
        display: grid;
        gap: 6px;
    }

    .msRow {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 12px;
        align-items: center;
    }

    .msLabel {
        white-space: nowrap;
    }

    .msRight {
        display: grid;
        grid-template-columns: auto auto;
        gap: 10px;
        align-items: center;
        justify-content: end;
    }

    /* align DotRating to the right inside the row */
    .msRight :global(.dots) {
        justify-self: end;
    }

    .hint {
        margin-top: 2px;
    }
</style>
