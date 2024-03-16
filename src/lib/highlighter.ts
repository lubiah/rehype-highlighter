import { BundledTheme, bundledThemes, getHighlighter, ThemeInput, type ThemeRegistration, type CodeToHastOptions } from "shiki";
import { Highlight } from "./index.d";
import fs from "node:fs/promises";
import { escapeCode } from "./utils";

const highlight: Highlight = async (code, lang, opts = {
	theme: "dracula",
	inlineCode: false
}
) => {
	const { loadThemes, inlineCode, theme } = opts;
	const loadedThemes: { [key: string]: ThemeRegistration } = {}; // This object stores the loaded themes
	const highlighter = await getHighlighter({ langs: [lang], themes: [] });

	if (loadThemes) {
		for (const theme in loadThemes) {
			const themeContents = JSON.parse(await fs.readFile(loadThemes[theme], "utf-8")) as ThemeRegistration;
			await highlighter.loadTheme(themeContents);
			loadedThemes[theme] = themeContents;
		}

	}
	if (typeof theme === 'string') {
		if (Object.keys(bundledThemes).includes(theme))
		await highlighter.loadTheme(theme as ThemeInput)
	}
	else {
		const themes = Object.values(theme);
		for (const _theme of themes){
			await highlighter.loadTheme(_theme as BundledTheme);
		}
	}

	//@ts-ignore	
	const highlighterOptions: CodeToHastOptions = {
		lang,
		transformers: []
	};
	//@ts-ignore
	(typeof theme === "string") ? highlighterOptions.theme = theme : highlighterOptions.themes = theme;

	if (inlineCode){

		highlighterOptions.transformers?.push({
			name: "rehype-highlighter-inline-code",
			code: function(this, element){
				element.properties.class = element.properties.class || "";
				if (this.pre.properties && this.pre.properties.class && element.properties) element.properties.class = element.properties.class + this.pre.properties.class.toString();
				element.properties['data-rh-highlighter-inline'] = true;
			}
		});
		return escapeCode(highlighter.codeToHtml(code, highlighterOptions));
	}

	// if (inlineCode)
	// 	return renderToHtml(tokens, {
	// 		bg: "#FFFFFF00",
	// 		elements: {
	// 			token: ({ style, children }) => {
	// 				children = escapeCode(children);
	// 				if (opts.spaceSubstitution) children = children.replace(/\s/g, "&nbsp;");
	// 				return `<span style='${;style}'>${children}</span>`;
	// 	});

	
	//@ts-ignore
	return escapeCode(highlighter.codeToHtml(code, highlighterOptions));
};

export default highlight;
