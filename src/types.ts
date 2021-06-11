export interface Entry{
    pluginName: string;
    name: string;
    icon: string;
    onClick(instance: CodeMirror.Editor, e: MouseEvent): void;
    enabled: true;
}