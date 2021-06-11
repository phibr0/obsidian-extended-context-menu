# Obsidian Extended Context Menu Plugin [![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/phibr0/obsidian-extended-context-menu)](https://github.com/phibr0/obsidian-extended-context-menu/releases) ![GitHub all releases](https://img.shields.io/github/downloads/phibr0/obsidian-extended-context-menu/total)

This Plugin adds a API to Obsidian, which enabled other Plugins to modify the (right-click) Editor Context Menu in a central Place, without overriding each others Menu.

## How to integrate this into my Plugin

### Registering Commands

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
//@ts-ignore
const menuPlugin = this.app.plugins.getPlugin("extended-context-menu");
this.app.workspace.onLayoutReady(() => {
    if(menuPlugin){
        //@ts-ignore
        menuPlugin.registerCommand(menu);
    } 
});
```

Unfortunetly the `//@ts-ignore`'s are neccessary since Obsidian doesn't expose the `.plugins` Property on `App`. You can of course register multiple Commands. You can disable already registered Commands by settings the `enabled` Property on the Entry Object to `false`, or you can use:

```ts
//@ts-ignore
this.app.plugins.getPlugin("extended-context-menu").unregisterCommand(menu);
```

## How to install

1. Go to **Community Plugins** in your [Obsidian](https://www.obsidian.md) Settings and **disable** Safe Mode
2. Click on **Browse** and search for “Extended Context Menu”
3. Click install
4. Toggle the Plugin on in the **Community Plugins** Tab

## Support me

If you find this Plugin helpful, consider supporting me:

<a href="https://www.buymeacoffee.com/phibr0"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=phibr0&button_colour=5F7FFF&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00"></a>
