<script lang="ts">
  import DotRating from "./DotRating.svelte";

  type Props = {
    origin?: string;
    level?: number;
    effect?: string;
    attribute?: string;
    skill?: string;
    labels: {
      origin: string;
      level: string;
      effect: string;
      attribute: string;
      skill: string;
    };
    readonly?: boolean;
  };

  let {
    origin = $bindable(""),
    level = $bindable(1),
    effect: effectValue = $bindable(""),
    attribute = $bindable(""),
    skill = $bindable(""),
    labels,
    readonly = false
  }: Props = $props();

  function clampLevel(value: number): number {
    if (!Number.isFinite(value)) return 1;
    return Math.min(5, Math.max(1, Math.trunc(value)));
  }

  $effect(() => {
    const clampedLevel = clampLevel(level);
    if (clampedLevel !== level) level = clampedLevel;
  });
</script>

<div class="superPower">
  <label class="field origin">
    <span class="ws-text">{labels.origin}</span>
    <input class="ws-input ws-text" type="text" bind:value={origin} {readonly} />
  </label>

  <div class="field level">
    <span class="ws-text">{labels.level}</span>
    <DotRating
      label={labels.level}
      bind:value={level}
      min={1}
      max={5}
      showValue={false}
      {readonly}
    />
  </div>

  <label class="field effect">
    <span class="ws-text">{labels.effect}</span>
    <input class="ws-input ws-text" type="text" bind:value={effectValue} {readonly} />
  </label>

  <label class="field attribute">
    <span class="ws-text">{labels.attribute}</span>
    <input class="ws-input ws-text" type="text" bind:value={attribute} {readonly} />
  </label>

  <label class="field skill">
    <span class="ws-text">{labels.skill}</span>
    <input class="ws-input ws-text" type="text" bind:value={skill} {readonly} />
  </label>
</div>

<style>
  .superPower {
    display: grid;
    grid-template-columns:
      minmax(130px, 1fr)
      max-content
      minmax(170px, 1.35fr)
      minmax(120px, 0.85fr)
      minmax(120px, 0.85fr);
    gap: 12px;
    align-items: end;
    min-width: 0;
  }

  .field {
    display: grid;
    gap: 5px;
    min-width: 0;
  }

  .field > span {
    overflow-wrap: anywhere;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }

  .level {
    align-content: end;
  }

  @media (max-width: 820px) {
    .superPower {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: start;
    }

    .level {
      align-self: end;
    }
  }

  @media (max-width: 520px) {
    .superPower {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
