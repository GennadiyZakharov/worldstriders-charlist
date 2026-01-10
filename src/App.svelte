<script lang="ts">
  import DotRating from "./components/DotRating.svelte";
  import CharacterMeta from "./components/CharacterMeta.svelte";
  import CharacterAttributes from "./components/CharacterAttributes.svelte";

  import Attribute from "./components/Attribute.svelte";
  import Skill from "./components/Skill.svelte";

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

  // Prepare lables for components basign on the curent languadge
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
            labels={{
    player: t(character.lang, "player"),
    journey: t(character.lang, "journey"),
    bigKey: t(character.lang, "bigKey"),
    smallKey: t(character.lang, "smallKey"),
    vice: t(character.lang, "vice"),
    concept: t(character.lang, "concept"),
    home: t(character.lang, "home"),
    stratoc: t(character.lang, "stratoc")
    }}
            bind:player={character.meta.playerName}
            bind:journey={character.meta.journey}
            bind:bigKey={character.meta.bigKey}
            bind:smallKey={character.meta.smallKey}
            bind:vice={character.meta.vice}
            bind:concept={character.meta.concept}
            bind:home={character.meta.home}
            bind:stratoc={character.meta.stratoc}
    />

    <div class="toolbar">
      <div class="lang">
        <span class="muted">{t(character.lang, "language")}:</span>
        <button type="button" class:active={character.lang === "en"} on:click={() => setLang("en")}>EN</button>
        <button type="button" class:active={character.lang === "ru"} on:click={() => setLang("ru")}>RU</button>
      </div>

      <div class="rightTools">
        <span class="muted">
          {t(character.lang, "autosave")}:
          <strong>{saveStatus === "saved" ? t(character.lang, "saved") : t(character.lang, "notSaved")}</strong>
        </span>

        <button type="button" on:click={exportYamlFile}>{t(character.lang, "exportYaml")}</button>

        <label class="filebtn">
          {t(character.lang, "importYaml")}
          <input type="file" accept=".yaml,.yml,text/yaml" on:change={importYamlFile} />
        </label>

        <button type="button" class="danger" on:click={resetAll}>{t(character.lang, "reset")}</button>
      </div>
    </div>
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

  .toolbar {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  .muted {
    font-size: 13px;
    opacity: 0.8;
  }

  .lang {
    display: inline-flex;
    gap: 8px;
    align-items: center;
  }

  button,
  .filebtn {
    border: 1px solid rgba(0, 0, 0, 0.25);
    background: white;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    user-select: none;
  }

  button.active {
    outline: 2px solid rgba(0, 70, 95, 0.35);
  }

  .danger {
    border-color: rgba(160, 0, 0, 0.35);
  }

  .filebtn input {
    display: none;
  }

  .rightTools {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

</style>
