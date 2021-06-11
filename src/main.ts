import { Menu, Plugin } from 'obsidian';
import { Entry} from 'src/types';
import { SettingsTab, Settings, DEFAULT_SETTINGS } from './settingsTab';
import { getID } from './util';


export default class ContextMenuPlugin extends Plugin {

	editorEntries: Entry[] = [];
	settings: Settings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerCodeMirror(cm => {
            cm.on('contextmenu', (instance, e) => {
                this.handleContextMenu(instance, e);
            });
        });

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	onunload(): void {
		this.app.workspace.iterateCodeMirrors((cm) => {
			cm.off("contextmenu", this.handleContextMenu);
		  });
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

  /**
   * Registers a new Command in the Editor.
   *
   * @param entry - Object, which implements Entry.
   * @public
   */
	public registerCommand(entry: Entry): void {
		if(!entry || !entry.icon || !entry.name || !entry.onClick) {
			console.error("Extended Context Menu: Entry Object doesn't exist or is malformed.");
		}
		this.editorEntries.push(entry);
		if(!this.settings.states.contains(this.settings.states.find((state) => state.id == getID(entry.pluginName, entry.name)))){
			this.settings.states.push({id: getID(entry.pluginName, entry.name), enabled: entry.enabled});
		}
		console.log(`%cSuccessfully registered ${entry.name} by ${entry.pluginName}`, "color: aquamarine");
	}

  /**
   * Unregisters a new Command in the Editor.
   *
   * @param entry - Object, which implements Entry. Has to already be registerd
   * @public
   */
	public unregisterCommand(entry: Entry): void {
		if(!entry || !entry.icon || !entry.name || !entry.onClick) {
			console.error("Extended Context Menu: Entry Object doesn't exist or is malformed.");
			return;
		}
		if(!this.editorEntries.contains(entry)){
			console.error('Cannot remove non existant Context Menu Command: ' + entry.name);
		}
		this.editorEntries.remove(entry);
		this.settings.states.remove(this.settings.states.find((state) => state.id == getID(entry.pluginName, entry.name)))
	}

	private handleContextMenu(instance: CodeMirror.Editor, e: MouseEvent){
		e.preventDefault();

		const menu = new Menu(this.app);

		if (instance.getSelection()) {
			menu.addItem((item) => {
				item.setTitle('Cut')
					.setIcon('cut')
					.onClick((_) => {
						this.copy(instance.getSelection());
						instance.replaceSelection("");
					});
			});
			menu.addItem((item) => {
				item.setTitle('Copy')
					.setIcon('copy')
					.onClick((_) => {
						this.copy(instance.getSelection());
					});
			});
		}
		menu.addItem((item) => {
			item.setTitle('Paste')
				.setIcon('paste')
				.onClick(async (_) => {
					instance.replaceSelection(await navigator.clipboard.readText());
				});
		});
		menu.addSeparator();

		this.editorEntries.forEach(entry => {
			if(entry.enabled && this.settings.states.find((state) => state.id == getID(entry.pluginName, entry.name)).enabled){
				menu.addItem((item) => {
					item.setTitle(entry.name)
						.setIcon(entry.icon)
						.onClick(() => {
							entry.onClick(instance, e);
						});
				});
			}
		});

		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	}

	private copy(string: string) {
		navigator.clipboard.writeText(string);
	}
}
