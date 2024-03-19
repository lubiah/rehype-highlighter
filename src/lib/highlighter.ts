import {
	BundledTheme,
	getHighlighter,
	type ThemeRegistration,
	type CodeToHastOptions,
	type SpecialTheme,
	bundledThemes
} from "shiki";
import { Highlight } from "./index.d";
import { visitParents } from "unist-util-visit-parents";

const highlight: Highlight = async (
	code,
	lang,
	opts = {
		theme: "dracula",
		inlineCode: false
	}
) => {

	const highlighter = await getHighlighter({ langs: [lang], themes: [] });

	if (opts.theme && Object.keys(bundledThemes).includes(opts.theme)) await highlighter.loadTheme(opts.theme as BundledTheme);
	else {
		if (opts.loadThemes && opts.theme && Object.keys(opts.loadThemes).includes(opts.theme)){
			const themeReg = opts.loadThemes[opts.theme];
			themeReg.name = opts.theme;
			await highlighter.loadTheme(themeReg);
		}
	}
	if (opts.themes && typeof opts.themes === 'object'){
		for (const theme in opts.themes){
			if (Object.keys(bundledThemes).includes(opts.themes[theme])) await highlighter.loadTheme(opts.themes[theme] as BundledTheme);
			else {
				console.log(theme)
			}
		}
	}

	//@ts-expect-error theme is required
	const highlighterOptions: CodeToHastOptions & {
		theme?: BundledTheme | ThemeRegistration | SpecialTheme;
		themes?: Partial<Record<string, BundledTheme | ThemeRegistration>>;
	} = {
		lang,
		transformers: []
	};
	(typeof opts.theme === "string")
		?
		(highlighterOptions.theme = opts.theme) :
		(highlighterOptions.themes = opts.theme);


	if (opts.inlineCode) {
		highlighterOptions.transformers?.push({
			name: "rehype-highlighter-inline-code",
			code: function (this, element) {
				element.properties.class = element.properties.class || "";
				if (this.pre.properties && this.pre.properties.class && element.properties)
					element.properties.class =
						element.properties.class + this.pre.properties.class.toString();
				element.properties["data-rh-highlighter-inline"] = true;
			}
		});

		if (opts.spaceSubstitution) {
			highlighterOptions.transformers?.push({
				name: "rehype-highlighter-space-substitution",
				code: function (this, element) {
					visitParents(element, "text", function (node) {
						node.value = node.value.replace(/\s/g, "&nbsp;");
					})
				}
			})
		}
		return highlighter.codeToHtml(code, highlighterOptions);
	}

	return highlighter.codeToHtml(code, highlighterOptions);

};

export default highlight;
