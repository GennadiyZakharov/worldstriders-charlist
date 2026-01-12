<script lang="ts">
  import Toolbar from "./components/Toolbar.svelte";

  import CharacterMeta from "./components/CharacterMeta.svelte";
  import CharacterAttributes from "./components/CharacterAttributes.svelte";
  import CharacterSkills from "./components/CharacterSkills.svelte";
  import PerkList from "./components/PerkList.svelte";

  import { t } from "./lib/i18n";
  import { defaultCharacter, normalizeCharacter } from "./lib/model";
  import { loadFromStorage, saveToStorage, clearStorage } from "./lib/storage";
  import { toYaml, fromYaml } from "./lib/yaml";
  import type { Lang } from "./lib/types";

  let character = defaultCharacter();
  let saveStatus: "saved" | "notSaved" = "notSaved";

  // Load on startup
  {
    const stored = loadFromStorage();
    if (stored) character = normalizeCharacter(stored);
  }

  // Autosave whenever character changes
  $: {
    saveToStorage(character);
    saveStatus = "saved";
  }

  // Prepare labels for components basing on the current language
  function getLabels<T extends Record<string, string>>(_lang: Lang, keys: T): T {
    const res = {} as Record<string, string>;
    for (const k in keys) {
      res[k] = t(_lang, keys[k]);
    }
    return res as T;
  }

  // Main character metadata
  $: metadataLabels = getLabels(character.lang, {
    name: "name",
    player: "player",
    journey: "journey",
    bigKey: "bigKey",
    smallKey: "smallKey",
    vice: "vice",
    concept: "concept",
    home: "home",
    stratoc: "stratoc"
  });

  $: toolbarLabels = getLabels(character.lang, {
    language: "language",
    autosave: "autosave",
    saved: "saved",
    notSaved: "notSaved",
    exportYaml: "exportYaml",
    importYaml: "importYaml",
    reset: "reset"
  });

  $: attributeLabels = getLabels(character.lang, {
    intellect: "intellect",
    quickWits: "quickWits",
    determination: "determination",
    magic: "magic",
    luck: "luck",
    bodyControl: "bodyControl",
    impressiveness: "impressiveness",
    manipulation: "manipulation",
    composure: "composure"
  });

  $: skillLabels = getLabels(character.lang, {
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
  });

  $: perkListLabels = {
    add: t(character.lang, "add"),
    delete: t(character.lang, "delete")
  };


  function setLang(lang: Lang) {
    character.lang = lang;
    character = character;
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
            saveStatus={saveStatus}
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
            bind:values={character.attributes}
    />
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
            bind:mental={character.skills.mental}
            bind:physical={character.skills.physical}
            bind:social={character.skills.social}
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

</style>
