import { Menu, Plugin } from 'obsidian';
import { Entry} from 'src/types';
import { SettingsTab } from './settingsTab';


export default class ContextMenuPlugin extends Plugin {

	editorEntries: Entry[] = [];

	async onload(): Promise<void> {
		this.registerCodeMirror(cm => {
            cm.on('contextmenu', (instance, e) => {
                this.handleContextMenu(instance, e);
            });
        });

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	onunload(): void {}

	public registerCommand(entry: Entry): void{
		if(!entry || !entry.icon || !entry.name || !entry.onClick) {
			console.error("Extended Context Menu: Entry Object doesn't exist or is malformed.");
		}
		this.editorEntries.push(entry);
		console.log(`%cSuccessfully registered ${entry.name} by ${entry.pluginName}`, "color: aquamarine");
	}

	public unregisterCommand(entry: Entry){
		if(!entry || !entry.icon || !entry.name || !entry.onClick) {
			console.error("Extended Context Menu: Entry Object doesn't exist or is malformed.");
			return;
		}
		if(!this.editorEntries.contains(entry)){
			console.error('Cannot remove non existant Context Menu Command: ' + entry.name);
		}
		this.editorEntries.remove(entry);
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
			if(entry.enabled){
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
