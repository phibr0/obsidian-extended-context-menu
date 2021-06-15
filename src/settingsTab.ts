import { App, PluginSettingTab, Setting } from "obsidian";
import ContextMenuPlugin from "./main";
import { getID } from "./util";

export interface Settings {
    states: EntryState[]
}

interface EntryState {
    id: string,
    enabled: boolean,
}

export const DEFAULT_SETTINGS: Settings = {
    states: []
}

export class SettingsTab extends PluginSettingTab {
    plugin: ContextMenuPlugin;

    constructor(app: App, plugin: ContextMenuPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Extended Context Menu' });

        this.plugin.editorEntries.forEach((entry) => {
            new Setting(containerEl)
                .setName(entry.name)
                .setDesc(`Added by: ${entry.pluginName}. It is currently ${entry.enabled ? "enabled" : "disabled"} by the Plugin itself.`)
                .addToggle((cb) => {
                    const state = this.plugin.settings.states.find((state) => state.id == getID(entry.pluginName, entry.name));
                    cb.setValue(state.enabled);
                    cb.setDisabled(!entry.enabled);
                    cb.onChange(async (value) => {
                        state.enabled = value;
                        await this.plugin.saveSettings();
                    })
                });
        });
    }
}