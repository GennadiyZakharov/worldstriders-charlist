<script lang="ts">
  import DotRating from "./components/DotRating.svelte";
  import Attribute from "./components/Attribute.svelte";

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

  type AttrId = keyof typeof character.attributes;

  const COL1: Array<{ soft?: string; key: AttrId }> = [
    { soft: "power", key: "intellect" },
    { soft: "grace", key: "quickWits" },
    { soft: "resistance", key: "determination" }
  ];

  const COL2: Array<{ key: AttrId }> = [
    { key: "magic" },
    { key: "luck" },
    { key: "bodyControl" }
  ];

  const COL3: Array<{ key: AttrId }> = [
    { key: "impressiveness" },
    { key: "manipulation" },
    { key: "composure" }
  ];
</script>

<div class="page">
  <!-- Header strip (logo + meta) -->
  <div class="sheet">
    <div class="logoRow">
      <div class="logoMark">🛡️</div>
      <div class="logoText">{t(character.lang, "title")}</div>
    </div>

    <div class="topGrid">
      <!-- Left block -->
      <div class="block">
        <div class="field">
          <div class="lbl">{t(character.lang, "name")}:</div>
          <input type="text" bind:value={character.meta.characterName} />
        </div>
        <div class="field">
          <div class="lbl">{t(character.lang, "player")}:</div>
          <input type="text" bind:value={character.meta.playerName} />
        </div>
        <div class="field">
          <div class="lbl">{t(character.lang, "journey")}:</div>
          <input type="text" bind:value={character.meta.journey} />
        </div>
      </div>

      <!-- Middle block -->
      <div class="block">
        <div class="field">
          <div class="lbl">{t(character.lang, "bigKey")}:</div>
          <input type="text" bind:value={character.meta.bigKey} />
        </div>
        <div class="field">
          <div class="lbl">{t(character.lang, "smallKey")}:</div>
          <input type="text" bind:value={character.meta.smallKey} />
        </div>
        <div class="field">
          <div class="lbl">{t(character.lang, "vice")}:</div>
          <input type="text" bind:value={character.meta.vice} />
        </div>
      </div>

      <!-- Right block -->
      <div class="block">
        <div class="field">
          <div class="lbl">{t(character.lang, "concept")}:</div>
          <input type="text" bind:value={character.meta.concept} />
        </div>
        <div class="field">
          <div class="lbl">{t(character.lang, "home")}:</div>
          <input type="text" bind:value={character.meta.home} />
        </div>
        <div class="field">
          <div class="lbl">{t(character.lang, "stratoc")}:</div>
          <input type="text" bind:value={character.meta.stratoc} />
        </div>
      </div>
    </div>

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
    <div class="sectionTitle">{t(character.lang, "attributesTitle")}</div>

    <div class="attrsGrid">

      <div class="attrCol">
        {#each COL1 as row (row.key)}
            <Attribute
              name={t(character.lang, row.key)}
              bind:value={character.attributes[row.key]}
            />
        {/each}
      </div>

      <div class="divider"></div>

      <div class="attrCol">
        {#each COL2 as row (row.key)}
            <Attribute
              name={t(character.lang, row.key)}
              bind:value={character.attributes[row.key]}
            />
        {/each}
      </div>

      <div class="divider"></div>

      <div class="attrCol">
        {#each COL3 as row (row.key)}
            <Attribute
              name={t(character.lang, row.key)}
              bind:value={character.attributes[row.key]}
            />
        {/each}
      </div>
    </div>
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

  .topGrid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 18px;
    align-items: start;
  }

  @media (max-width: 980px) {
    .topGrid {
      grid-template-columns: 1fr;
    }
  }

  .block {
    display: grid;
    gap: 10px;
  }

  .field {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    align-items: center;
  }

  .lbl {
    font-size: 14px;
    opacity: 0.9;
    white-space: nowrap;
  }

  input[type="text"] {
    height: 34px;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    background: white;
    font-size: 14px;
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

  .sectionTitle {
    text-align: center;
    font-weight: 800;
    letter-spacing: 2px;
    padding: 4px 0 10px;
  }

  .attrsGrid {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr;
    gap: 16px;
    align-items: start;
  }

  @media (max-width: 980px) {
    .attrsGrid {
      grid-template-columns: 1fr;
    }
    .divider {
      display: none;
    }
  }

  .divider {
    width: 2px;
    background: rgba(0, 70, 95, 0.9);
    border-radius: 2px;
  }

  .attrCol {
    display: grid;
    gap: 10px;
  }

  .attrRow {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
    padding: 6px 0;
  }

  .attrText {
    display: grid;
    gap: 2px;
  }

  .attrText.single {
    padding-top: 8px; /* visually aligns with other rows that have soft label */
  }

  .soft {
    font-size: 12px;
    opacity: 0.55;
    letter-spacing: 0.5px;
  }

  .hard {
    font-size: 16px;
    font-weight: 700;
  }
</style>
