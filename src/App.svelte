<script lang="ts">
  import StatStepper from "./components/StatStepper.svelte";
  import DotRating from "./components/DotRating.svelte";
  import TextAreaField from "./components/TextAreaField.svelte";

  import { t } from "./lib/i18n.ts";
  import { defaultCharacter, normalizeCharacter } from "./lib/model.ts";
  import { loadFromStorage, saveToStorage, clearStorage } from "./lib/storage.ts";
  import { toYaml, fromYaml } from "./lib/yaml.ts";
  import type { Character, Lang } from "./lib/types.ts";


  let character: Character = defaultCharacter();
  let saveStatus: "saved" | "notSaved" = "notSaved";

  // Load on startup
  {
    const stored = loadFromStorage();
    if (stored) character = normalizeCharacter(stored);
  }

  // Autosave whenever character changes
  $: {
    // Any mutation triggers this reactive statement
    saveToStorage(character);
    saveStatus = "saved";
    // mark it "notSaved" briefly before next save? optional
  }

  function setLang(lang: Lang): void {
    character.lang = lang;
  }

  function exportYamlFile(): void {
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

  async function importYamlFile(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = fromYaml(text);
      character = normalizeCharacter(parsed);
      saveStatus = "saved";
    } catch (err) {
      alert("Failed to import YAML: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      // allow importing the same file again by resetting the input
      target.value = "";
    }
  }

  function resetAll(): void {
    if (!confirm("Reset character to defaults?")) return;
    character = defaultCharacter();
    clearStorage();
  }

  // Labels for fields
  type Translation = { en: string; ru: string };
  type Entry = [string, Translation];

  const ATTR: Entry[] = [
    ["strength", { en: "Strength", ru: "Сила" }],
    ["agility", { en: "Agility", ru: "Ловкость" }],
    ["intellect", { en: "Intellect", ru: "Интеллект" }],
    ["willpower", { en: "Willpower", ru: "Воля" }]
  ];

  const SKILLS: Entry[] = [
    ["melee", { en: "Melee", ru: "Ближний бой" }],
    ["ranged", { en: "Ranged", ru: "Дальний бой" }],
    ["stealth", { en: "Stealth", ru: "Скрытность" }],
    ["diplomacy", { en: "Diplomacy", ru: "Дипломатия" }],
    ["medicine", { en: "Medicine", ru: "Медицина" }]
  ];

  function labelFor(entry: Entry): string {
    return entry[1][character.lang] ?? entry[1].en;
  }
</script>

<div class="page">
  <header class="topbar">
    <div class="title">
      <h1>{t(character.lang, "title")}</h1>
      <div class="status">
        {t(character.lang, "autosave")}: <strong>{saveStatus === "saved" ? t(character.lang, "saved") : t(character.lang, "notSaved")}</strong>
      </div>
    </div>

    <div class="actions">
      <div class="lang">
        <span class="label">{t(character.lang, "language")}:</span>
        <button type="button" class:active={character.lang === "en"} on:click={() => setLang("en")}>EN</button>
        <button type="button" class:active={character.lang === "ru"} on:click={() => setLang("ru")}>RU</button>
      </div>

      <button type="button" on:click={exportYamlFile}>{t(character.lang, "exportYaml")}</button>

      <label class="filebtn">
        {t(character.lang, "importYaml")}
        <input type="file" accept=".yaml,.yml,text/yaml" on:change={importYamlFile} />
      </label>

      <button type="button" class="danger" on:click={resetAll}>{t(character.lang, "reset")}</button>
    </div>
  </header>

  <main class="grid">
    <section class="card">
      <h2>{t(character.lang, "meta")}</h2>

      <div class="form">
        <label>
          <div class="lbl">{t(character.lang, "characterName")}</div>
          <input type="text" bind:value={character.meta.characterName} />
        </label>

        <label>
          <div class="lbl">{t(character.lang, "playerName")}</div>
          <input type="text" bind:value={character.meta.playerName} />
        </label>

        <label>
          <div class="lbl">{t(character.lang, "faction")}</div>
          <input type="text" bind:value={character.meta.faction} />
        </label>

        <label class="full">
          <div class="lbl">{t(character.lang, "concept")}</div>
          <input type="text" bind:value={character.meta.concept} />
        </label>
      </div>
    </section>

    <section class="card">
      <h2>{t(character.lang, "attributes")}</h2>
      <div class="list">
        {#each ATTR as entry (entry[0])}
          <DotRating
            label={labelFor(entry)}
            bind:value={character.attributes[entry[0]]}
            min={1}
            max={10}
            step={1}
            shape="circle"
          />
        {/each}
      </div>
    </section>

    <section class="card">
      <h2>{t(character.lang, "skills")}</h2>
      <div class="list">
        {#each SKILLS as entry (entry[0])}
          <DotRating
            label={labelFor(entry)}
            bind:value={character.skills[entry[0]]}
            min={0}
            max={20}
            step={1}
            shape="square"
          />
        {/each}
      </div>
    </section>

    <section class="card">
      <h2>{t(character.lang, "notes")}</h2>

      <div class="notes">
        <TextAreaField
          label={t(character.lang, "background")}
          bind:value={character.notes.background}
          rows={6}
        />

        <TextAreaField
          label={t(character.lang, "inventory")}
          bind:value={character.notes.inventory}
          rows={6}
        />

        <TextAreaField
          label={t(character.lang, "contacts")}
          bind:value={character.notes.contacts}
          rows={6}
        />
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="small">
      schemaVersion: {character.schemaVersion} · updatedAt: {character.updatedAt}
    </div>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Liberation Sans", sans-serif;
    background: #f4f6fb;
    color: #111;
  }

  .page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 18px;
    display: grid;
    gap: 14px;
  }

  .topbar {
    display: grid;
    gap: 12px;
    padding: 14px 14px;
    border: 1px solid rgba(0,0,0,0.10);
    border-radius: 16px;
    background: rgba(255,255,255,0.85);
    box-shadow: 0 6px 24px rgba(0,0,0,0.06);
  }

  .title {
    display: grid;
    gap: 4px;
  }

  h1 {
    margin: 0;
    font-size: 22px;
    line-height: 1.15;
  }

  .status {
    font-size: 13px;
    opacity: 0.85;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .lang {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    padding-right: 8px;
    margin-right: 6px;
    border-right: 1px solid rgba(0,0,0,0.12);
  }

  .lang .label {
    font-size: 13px;
    opacity: 0.85;
  }

  button, .filebtn {
    border: 1px solid rgba(0,0,0,0.16);
    background: white;
    border-radius: 12px;
    padding: 10px 12px;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    user-select: none;
  }

  button:hover, .filebtn:hover {
    background: rgba(255,255,255,0.65);
  }

  button.active {
    outline: 2px solid rgba(0,0,0,0.25);
  }

  .danger {
    border-color: rgba(160, 0, 0, 0.35);
  }

  .filebtn input {
    display: none;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr; }
  }

  .card {
    padding: 14px;
    border: 1px solid rgba(0,0,0,0.10);
    border-radius: 16px;
    background: rgba(255,255,255,0.85);
    box-shadow: 0 6px 24px rgba(0,0,0,0.06);
    display: grid;
    gap: 12px;
  }

  .card h2 {
    margin: 0;
    font-size: 16px;
  }

  .form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .form label {
    display: grid;
    gap: 6px;
  }

  .form label.full {
    grid-column: 1 / -1;
  }

  .lbl {
    font-size: 13px;
    opacity: 0.85;
    font-weight: 600;
  }

  input[type="text"] {
    height: 38px;
    padding: 8px 10px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.16);
    background: white;
    font-size: 14px;
  }

  .list {
    display: grid;
    gap: 10px;
  }

  .notes {
    display: grid;
    gap: 12px;
  }

  .footer {
    padding: 8px 2px;
    opacity: 0.75;
  }

  .small {
    font-size: 12px;
  }
</style>
