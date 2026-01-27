<script lang="ts">
  import Toolbar from "./components/Toolbar.svelte";

  import CharacterMeta from "./components/CharacterMeta.svelte";
  import CharacterAttributes from "./components/CharacterAttributes.svelte";
  import CharacterCharacteristics from "./components/CharacterCharacteristics.svelte";
  import ExperienceMeter from "./components/ExperienceMeter.svelte";
  import Wounds from "./components/Wounds.svelte";
  import CharacterSkills from "./components/CharacterSkills.svelte";
  import PerkList from "./components/PerkList.svelte";

  import { t } from "./lib/i18n";
  import { defaultCharacter, normalizeCharacter } from "./lib/model";
  import { loadFromStorage, saveToStorage, clearStorage } from "./lib/storage";
  import { toYaml, fromYaml } from "./lib/yaml";
  import type { Lang } from "./lib/types";

  let character = $state(defaultCharacter());
  let saveStatus: "saved" | "notSaved" = "notSaved";

  // Load on startup
  {
    const stored = loadFromStorage();
    if (stored) character = normalizeCharacter(stored);
  }

  // Autosave whenever character changes
  $effect(() => {
    saveToStorage(character);
  });

  // Prepare labels for components basing on the current language
  function getLabels<T extends Record<string, string>>(_lang: Lang, keys: T): T {
    const res = {} as Record<string, string>;
    for (const k in keys) {
      res[k] = t(_lang, keys[k]);
    }
    return res as T;
  }

  // Main character metadata
  let metadataLabels = $derived(getLabels(character.lang, {
    name: "name",
    player: "player",
    journey: "journey",
    bigKey: "bigKey",
    smallKey: "smallKey",
    vice: "vice",
    concept: "concept",
    home: "home",
    stratoc: "stratoc"
  }));

  let toolbarLabels = $derived(getLabels(character.lang, {
    language: "language",
    exportYaml: "exportYaml",
    importYaml: "importYaml",
    reset: "reset"
  }));

  let attributeLabels = $derived(getLabels(character.lang, {
    intellect: "intellect",
    quickWits: "quickWits",
    determination: "determination",
    magic: "magic",
    luck: "luck",
    bodyControl: "bodyControl",
    impressiveness: "impressiveness",
    manipulation: "manipulation",
    composure: "composure"
  }));

  let characteristicsLabels = $derived(getLabels(character.lang, {
    confidence: "confidence",
    health: "health",
    aura: "aura",
    soul: "soul",
    qi: "qi",
    willpower: "willpower",
    charge: "charge",

    body: "body",
    strength: "strength",
    agility: "agility",
    endurance: "endurance",

    derivedTitle: "derivedTitle",
    size: "size",
    defense: "defense",
    initiativeMod: "initiativeMod",
    speed: "speed",
    perception: "perception"


  }));


  let skillLabels = $derived(getLabels(character.lang, {
    humanities: "skill_humanities",
    technical: "skill_technical",
    business: "skill_business",
    investigation: "skill_investigation",
    medicine: "skill_medicine",
    occult: "skill_occult",
    politics: "skill_politics",
    natural: "skill_natural",

    athletics: "skill_athletics",
    fight: "skill_fight",
    driving: "skill_driving",
    firearms: "skill_firearms",
    craft: "skill_craft",
    stealth: "skill_stealth",
    survival: "skill_survival",
    coldWeapons: "skill_coldWeapons",

    animalHandling: "skill_animalHandling",
    empathy: "skill_empathy",
    expression: "skill_expression",
    etiquette: "skill_etiquette",
    seduction: "skill_seduction",
    communication: "skill_communication",
    faces: "skill_faces",
    deception: "skill_deception"
  }));

  let perkListLabels = $derived({
    add: t(character.lang, "add"),
    delete: t(character.lang, "delete")
  });


  function setLang(lang: Lang) {
    character.lang = lang;
  }

  function exportYamlFile() {
    const yaml = toYaml(character);
    const blob = new Blob([yaml], { type: "text/yaml;charset=utf-8" });

    const safeName = (character.meta.characterName || "character")
      .trim()
      .replace(/[^\p{L}\p{N}_-]+/gu, "_");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `${safeName || "character"}_${timestamp}.yaml`;

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  async function importYamlFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = fromYaml(text);
      character = normalizeCharacter(parsed);
      saveStatus = "saved";
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      alert("Failed to import YAML: " + message);
    } finally {
      input.value = "";
    }
  }

  function resetAll() {
    if (!confirm("Reset character to defaults?")) return;
    character = defaultCharacter();
    clearStorage();
  }
</script>

<div class="page ws">
  <!-- Header strip (logo + meta) -->
  <div class="sheet">
    <div class="logoRow">
      <div class="logoMark">🛡️</div>
      <div class="logoText">{t(character.lang, "title")}</div>
    </div>

    <CharacterMeta
            labels={metadataLabels}
            bind:name={character.meta.characterName}
            bind:player={character.meta.playerName}
            bind:journey={character.meta.journey}
            bind:bigKey={character.meta.bigKey}
            bind:smallKey={character.meta.smallKey}
            bind:vice={character.meta.vice}
            bind:concept={character.meta.concept}
            bind:home={character.meta.home}
            bind:stratoc={character.meta.stratoc}
    />

    <Toolbar
            lang={character.lang}
            labels={toolbarLabels}
            onSetLang={setLang}
            onExportYaml={exportYamlFile}
            onImportYaml={importYamlFile}
            onReset={resetAll}
    />

  </div>

  <!-- Attributes box -->
  <div class="sheet">
    <CharacterAttributes
            title={t(character.lang, "attributesTitle")}
            labels={attributeLabels}
            bind:attributes={character.attributes}
    />
  </div>

  <div class="sheet">
  <CharacterCharacteristics
          title={t(character.lang, "characteristicsTitle")}
          labels={characteristicsLabels}
          bind:characteristics={character.characteristics}
          character={character}
  />
  </div>

  <div class="sheet xpWounds">
    <!-- LEFT: two Experience meters -->
    <!-- Experience (under Characteristics) -->
    <div class="sheet xpGrid">
      <ExperienceMeter
              caption={t(character.lang, "experienceTitle")}
              bind:experience={character.experience}
      />

    </div>
    <!-- RIGHT: wounds, boxed like other blocks -->
    <div class="woundsBox">
      <Wounds
              caption={t(character.lang, "woundsTitle")}
              bind:wounds={character.wounds}
      />
    </div>
  </div>

  <!-- Skill box -->
  <div class="sheet">
    <CharacterSkills
            title={t(character.lang, "skillsTitle")}
            mentalTitle={t(character.lang, "mentalTitle")}
            mentalSub={t(character.lang, "mentalSub")}
            physicalTitle={t(character.lang, "physicalTitle")}
            physicalSub={t(character.lang, "physicalSub")}
            socialTitle={t(character.lang, "socialTitle")}
            socialSub={t(character.lang, "socialSub")}
            labels={skillLabels}
            bind:skills={character.skills}
    />
  </div>

  <!-- Perks -->
  <div class="sheet">
    <PerkList
            title={t(character.lang, "permanentPerksTitle")}
            labels={perkListLabels}
            bind:perks={character.permanentPerks}
    />
  </div>

  <div class="sheet">
    <PerkList
            title={t(character.lang, "temporaryPerksTitle")}
            labels={perkListLabels}
            bind:perks={character.temporaryPerks}
    />
  </div>

</div>

<style>
  :global(body) {
    margin: 0;
    background: white; /* as requested */
    color: #111;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Liberation Sans",
      sans-serif;
  }

  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 18px;
    display: grid;
    gap: 16px;
  }

  .sheet {
    border: 2px solid rgba(0, 70, 95, 0.9);
    border-radius: 10px;
    padding: 14px 16px;
  }

  .logoRow {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding-bottom: 10px;
  }

  .logoMark {
    font-size: 22px;
  }

  .logoText {
    font-weight: 800;
    letter-spacing: 1px;
    font-size: 20px;
  }

  .xpWounds {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    align-items: start;
  }

  /* Two columns for experience meters */
  .xpGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
  }

  /* Wounds should look like a block; this assumes `.sheet` already draws the rectangle.
     If `.sheet` already provides the rectangle, you can remove woundsBox styling entirely. */
  .woundsBox {
    min-width: 260px; /* tweak if needed */
  }

  @media (max-width: 900px) {
    .xpWounds {
      grid-template-columns: 1fr;
    }

    .xpGrid {
      grid-template-columns: 1fr;
    }

    .woundsBox {
      min-width: 0;
    }
  }

</style>
