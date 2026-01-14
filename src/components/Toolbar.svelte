<script lang="ts">
    import type { Lang } from "../lib/types";

    export let lang: Lang;

    export let labels: {
        language: string;
        exportYaml: string;
        importYaml: string;
        reset: string;
    };

    export let onSetLang: (lang: Lang) => void;
    export let onExportYaml: () => void;
    export let onImportYaml: (event: Event) => void;
    export let onReset: () => void;

    // Optional: if you want to disable everything (e.g. readonly/print mode)
    export let disabled: boolean = false;
</script>

<div class="toolbar">
    <div class="lang">
        <span class="ws-muted">{labels.language}:</span>
        <button
                type="button"
                class:active={lang === "en"}
                on:click={() => onSetLang("en")}
                disabled={disabled}
        >
            EN
        </button>
        <button
                type="button"
                class:active={lang === "ru"}
                on:click={() => onSetLang("ru")}
                disabled={disabled}
        >
            RU
        </button>
    </div>

    <div class="rightTools">

        <button type="button" on:click={onExportYaml} disabled={disabled}>
            {labels.exportYaml}
        </button>

        <label class="filebtn" class:disabled={disabled}>
            {labels.importYaml}
            <input
                    type="file"
                    accept=".yaml,.yml,text/yaml"
                    on:change={onImportYaml}
                    disabled={disabled}
            />
        </label>

        <button type="button" class="danger" on:click={onReset} disabled={disabled}>
            {labels.reset}
        </button>
    </div>
</div>

<style>
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

    .lang {
        display: inline-flex;
        gap: 8px;
        align-items: center;
    }

    .rightTools {
        display: inline-flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
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

    .filebtn.disabled {
        opacity: 0.6;
        cursor: default;
    }
</style>
