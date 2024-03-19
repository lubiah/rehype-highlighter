import type { BundledTheme, ThemeRegistration } from "shiki";

type LiteralUnion<T extends U, U = string> = T | (U & { zz_IGNORE_ME?: never });

declare module "hast" {
	interface Properties {
		/** An array which contains the CSS classes of the node */
		className?: string[];
	}
}

declare interface PluginOptions {
	theme?: LiteralUnion<BundledTheme>;
	themes?: Record<string, string>;
	loadThemes?: Record<string, ThemeRegistration>
	inlineCode?: {
		spaceSubstitution?: boolean;
		theme?: PluginOptions["theme"];
	};
}

declare type Highlight = (
	code: string,
	lang: string,
	opts: {
		inlineCode: boolean;
		theme?: PluginOptions['theme'];
		themes?: PluginOptions['themes'];
		spaceSubstitution?: boolean;
		loadThemes?: PluginOptions['loadThemes'];
	} = {}
) => Promise<string>;

declare type HighlightInline = (
	code,
	lang,
	opts: {
		theme?: PluginOptions["theme"];
	} = {}
) => Promise<string>;
