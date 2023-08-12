import type { Theme } from "shiki";

type LiteralUnion<T extends U, U = string> = T | (U & { zz_IGNORE_ME?: never });

declare module "hast" {
	interface Properties {
		/** An array which contains the CSS classes of the node */
		className?: string[];
	}
}

declare interface PluginOptions {
	theme?: LiteralUnion<Theme> | LiteralUnion<Theme>[];
	loadThemes?: {
		[key: string]: string;
	};
	inlineCode?: {
		spaceSubstitution?: boolean;
		theme?: PluginOptions['theme'];
	};
}

declare type Highlight = (
	code: string,
	lang: string,
	opts: {
		inlineCode: boolean;
		theme: Theme | string;
		loadThemes?: PluginOptions["loadThemes"];
		spaceSubstitution?: boolean;
	} = {}
) => Promise<string>;

declare type HighlightInline = (
	code,
	lang,
	opts: {
		theme?: PluginOptions["theme"];
	} = {}
) => Promise<string>;
