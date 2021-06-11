import { App, PluginSettingTab, Setting } from "obsidian";
import ContextMenuPlugin from "./main";

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
                .setDesc(`Added by: ${entry.pluginName}. It is currently ${entry.enabled ? "enabled" : "disabled"}.`)
        });
	}
}