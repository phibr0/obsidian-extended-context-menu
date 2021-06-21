# **This is already deprecated: https://forum.obsidian.md/t/obsidian-release-v0-12-6-insider-build/19914**

# Obsidian Extended Context Menu Plugin [![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/phibr0/obsidian-extended-context-menu)](https://github.com/phibr0/obsidian-extended-context-menu/releases) ![GitHub all releases](https://img.shields.io/github/downloads/phibr0/obsidian-extended-context-menu/total)

This Plugin adds a API to Obsidian, which enables other Plugins to modify the (right-click) Editor Context Menu in a central Place, without overriding each others Menu. **This will probably get removed when Obsidian provides its own API to do this.**

## How to integrate this into my Plugin

Create new Objects, using the following Schema:

```ts
{
    pluginName: string;
    name: string;
    icon: string;
    onClick(instance: CodeMirror.Editor, e: MouseEvent): void;
    enabled: true;
}
```

**Example:**

```ts
const menu = {
    pluginName: this.manifest.id,
    name: "Testing",
    icon: "quote-glyph",
    onClick: () => {new Notice(`Awesome Command by ${this.manifest.author}`)},
    enabled: true
}
```

Then register them like so:

```ts
this.app.workspace.onLayoutReady(() => {
    //@ts-ignore
    const menuPlugin = this.app.plugins.getPlugin("extended-context-menu");
    if(menuPlugin){
        //@ts-ignore
        menuPlugin.registerCommand(menu);
    } 
});
```

Unfortunetly the `//@ts-ignore`'s are neccessary since Obsidian doesn't expose the `plugins` property on `App`. You can of course register multiple Commands. You can disable already registered Commands by settings the `enabled` Property on the Entry Object to `false`, or you can use:

```ts
//@ts-ignore
this.app.plugins.getPlugin("extended-context-menu").unregisterCommand(menu);
```

Please remember to unload the Context Menus using this Method when unloading your Plugin.

### Extras

- A working Example can also be seen in my [Obsidian-Dictionary](https://github.com/phibr0/obsidian-dictionary) Plugin [right here](https://github.com/phibr0/obsidian-dictionary/blob/df53bbe6a368e31187d242e5bbd1f278136e02f8/src/main.ts#L76).
- You can use @pjeby's [Hotkey Helper URI](https://github.com/pjeby/hotkey-helper#plugin-urls) to open the Plugin's Download Page automatically

## How to install

1. Go to **Community Plugins** in your [Obsidian](https://www.obsidian.md) Settings and **disable** Safe Mode
2. Click on **Browse** and search for “Extended Context Menu”
3. Click install
4. Toggle the Plugin on in the **Community Plugins** Tab

## Support me

If you find this Plugin helpful, consider supporting me:

<a href="https://www.buymeacoffee.com/phibr0"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=phibr0&button_colour=5F7FFF&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00"></a>
