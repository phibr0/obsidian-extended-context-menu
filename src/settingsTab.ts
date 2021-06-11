import { App, PluginSettingTab, Setting } from "obsidian";
import ContextMenuPlugin from "./main";
import { Entry } from "./types";

export interface Settings {
	state: Map<Entry, boolean>;
}

export const DEFAULT_SETTINGS: Settings = {
	state: new Map<Entry, boolean>(),
}

export class SettingsTab extends PluginSettingTab {
	plugin: ContextMenuPlugin;

	constructor(app: App, plugin: ContextMenuPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Extended Context Menu'});

        this.plugin.editorEntries.forEach((entry) => {
            new Setting(containerEl)
                .setName(entry.name)
                .setDesc(`Added by: ${entry.pluginName}. It is currently ${entry.enabled ? "enabled" : "disabled"} by the Plugin itself.`)
				.addToggle((cb) => {
					cb.setValue(this.plugin.settings.state.get(entry));
					cb.setDisabled(!entry.enabled);
					cb.onChange(async (value) => {
						this.plugin.settings.state.set(entry, value);
						await this.plugin.saveSettings();
					})
				});
        });
	}
}