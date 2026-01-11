<script lang="ts">
  import Toolbar from "./components/Toolbar.svelte";

  import CharacterMeta from "./components/CharacterMeta.svelte";
  import CharacterAttributes from "./components/CharacterAttributes.svelte";
  import CharacterSkills from "./components/CharacterSkills.svelte";

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
  // Main character metadata
  $: metadataLabels = {
    name: t(character.lang, "name"),
    player: t(character.lang, "player"),
    journey: t(character.lang, "journey"),
    bigKey: t(character.lang, "bigKey"),
    smallKey: t(character.lang, "smallKey"),
    vice: t(character.lang, "vice"),
    concept: t(character.lang, "concept"),
    home: t(character.lang, "home"),
    stratoc: t(character.lang, "stratoc")
  }

  $: toolbarLabels = {
    language: t(character.lang, "language"),
    autosave: t(character.lang, "autosave"),
    saved: t(character.lang, "saved"),
    notSaved: t(character.lang, "notSaved"),
    exportYaml: t(character.lang, "exportYaml"),
    importYaml: t(character.lang, "importYaml"),
    reset: t(character.lang, "reset")
  };

  $: attributeLabels = {
    intellect: t(character.lang, "intellect"),
    quickWits: t(character.lang, "quickWits"),
    determination: t(character.lang, "determination"),

    magic: t(character.lang, "magic"),
    luck: t(character.lang, "luck"),
    bodyControl: t(character.lang, "bodyControl"),

    impressiveness: t(character.lang, "impressiveness"),
    manipulation: t(character.lang, "manipulation"),
    composure: t(character.lang, "composure")
  };

  $: skillLabels = {
    humanities: t(character.lang, "skill_humanities"),
    technical: t(character.lang, "skill_technical"),
    business: t(character.lang, "skill_business"),
    investigation: t(character.lang, "skill_investigation"),
    medicine: t(character.lang, "skill_medicine"),
    occult: t(character.lang, "skill_occult"),
    politics: t(character.lang, "skill_politics"),
    natural: t(character.lang, "skill_natural"),

    athletics: t(character.lang, "skill_athletics"),
    fight: t(character.lang, "skill_fight"),
    driving: t(character.lang, "skill_driving"),
    firearms: t(character.lang, "skill_firearms"),
    craft: t(character.lang, "skill_craft"),
    stealth: t(character.lang, "skill_stealth"),
    survival: t(character.lang, "skill_survival"),
    coldWeapons: t(character.lang, "skill_coldWeapons"),

    animalHandling: t(character.lang, "skill_animalHandling"),
    empathy: t(character.lang, "skill_empathy"),
    expression: t(character.lang, "skill_expression"),
    etiquette: t(character.lang, "skill_etiquette"),
    seduction: t(character.lang, "skill_seduction"),
    communication: t(character.lang, "skill_communication"),
    faces: t(character.lang, "skill_faces"),
    deception: t(character.lang, "skill_deception")
  };

  function setLang(lang: Lang) {
    character.lang = lang;
  }

  function exportYamlFile() {
    const yaml = toYaml(character);
    const blob = new Blob([yaml], { type: "text/yaml;charset=utf-8" });

    const safeName = (character.meta.characterName || "character")
      .trim()
      .replace(/[^\p{L}\p{N}_-]+/gu, "_");
    const filename = `${safeName || "character"}.yaml`;

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
    } catch (err: any) {
      alert("Failed to import YAML: " + (err?.message || String(err)));
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
            values={character.attributes}
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
            mental={character.skills.mental}
            physical={character.skills.physical}
            social={character.skills.social}
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
