# rehype-highlighter

rehype-highlighter is a [rehype](https://github.com/rehypejs/rehype) plugin that brings your Markdown code blocks to life with beautiful syntax highlighting.  
It uses [Shiki](https://shiki-play.matsu.io/) under the hood to highlight both fenced code blocks and inline code snippets.

## Installation

Get ready to add some flair to your docs by installing rehype-highlighter!

* pnpm  
  `pnpm add -D rehype-highlighter`
* npm  
  `npm install -D rehype-highlighter`
* yarn  
  `yarn add -D rehype-highlighter`

## How it works

rehype-highlighter will scan through your markdown document and look for code blocks. When it finds a code block(whether fenced or inline), it will highlight it with Shiki to make it pop!

For fenced code blocks, it will wrap the highlighted code like this:

```html
<pre
	class="rehype-highlighter"
	data-rh-highlighter-theme="theme"
><code><!--SHIKI-HIGHLIGHTED CODE--></code></pre>
```

For inline code, it will wrap it like this:

```html
<code class="rehype-highlighter" data-rh-highlighter-inline data-rh-highlighter-theme="theme"><!--SHIKI-HIGHLIGHTED CODE--></code>
```

This way, you can target the classes or attributes with your CSS and provide additional styling, or to toggle code blocks.

### Highlight Inline Code

You can also easily highlight inline code snippets to spice up your docs. Simply precede the inline code with `:language:` where `language` is the programming language to highlight it as.

For example, to highlight `import time from time` in Python:

`:python:import time from time`

No need to stress about spacing - **the highlight will work with or without a space after the last colon**.

#### Escape Highlighting

If you actually want to show an inline code snippet without highlighting, just add a space before the first colon:

` :js:console.log("")`

The space will be removed but will prevent highlighting.

rehype-highlighter makes it easy to add beautiful, readable syntax highlighting to your Markdown code. Now your documentation can be informative AND stylish!

## Usage

In order to use this plugin, you need to add it to your list of rehype plugins.

Here's one example on how you can set it up.

```javascript
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlighter from "rehype-highlighter";
import rehypeStringify from "rehype-stringify";

const processor = await unified()
	.use(remarkParse)
	.use(remarkRehype)
	.use(rehypeHighlighter)
	.use(rehypeStringify)
	.process("YOUR MARKDOWN CODE");
```

If you're using Mdsvex with Svelte

```javascript
import { defineMDSveXConfig as defineConfig } from "mdsvex";
import rehypeHighlighter from "rehype-highlighter";

const config = defineConfig({
	extensions: [".md"],
	rehypePlugins: [rehypeHighlighter]
});
```

And that's all.

## Options

There are a bunch of options which you can use with this plugin.  
You just need to pass in an object with the plugin.

**options.theme**  
Type: `string | string[]` (A string or array of strings).

This option is used to set the theme which should be used to highlight your code. It can be any of the [built in themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md) or you can also load your custom themes and specify the name here.

If you specify an array, for each code block it finds, it will generate each theme with the code block.
This is useful if you have multiple themes on your website. You can easily hide them with the `data-rh-highlighter-theme` attribute which the plugin sets on the code block.

Example,

```javascript
const processor = await unified()
	.use(remarkParse)
	.use(remarkRehype)
	.use(rehypeHighlighter, {
		theme: ["dracula", "github-light"]
	})
	.use(rehypeStringify)
	.process("YOUR MARKDOWN CODE");
```

The option above set will generate two code blocks for each code block it finds, this also applies to inline code. Each code block will have an attribute of `data-rm-highlighter-theme`.
So in order to show `dracula` in night mode and show `github-light` in light mode or the default mode, you will use the following CSS.

```css
@media (prefers-color-scheme: dark) {
	pre[data-rm-highlighter-theme="github-light"],
  code[data-rm-highlighter-theme='github-light'] /**For inline code blocks*/ {
		display: none;
	}
}

@media (prefers-color-scheme: light), (prefers-color-scheme: no-preference) {
	pre[data-rm-highlighter-theme="dracula"],
	code[data-rm-highlighter-theme="dracula"] {
		display: none;
	}
}
```

**options.loadThemes**  
Type: `object`

This is the way to load themes which are not included in the Shiki package. Also, you can load as many themes as you want.
Just pass in the name of the theme and it's path and it will be registered.
After adding a theme here, you can then use `options.theme` to select the theme which you added by using the name you specified here.

Example,

```javascript
import { fileURLToPath } from "node:url";

const processor = await unified()
	.use(remarkParse)
	.use(remarkRehype)
	.use(rehypeHighlighter, {
		loadThemes: {
			moonlight: fileURLToPath(new URL("./themes/moonlight.json", import.meta.url)),
			"ayu-dark": fileURLToPath(new URL("./themes/ayu-dark.json", import.meta.url))
		}
	})
	.use(rehypeStringify)
	.process("YOUR MARKDOWN CODE");
```

Now, you can set the highlighter to use those themes by passing the name to `options.theme`.

**options.inlineCode.theme**  
Type: `string | string[]` (A string or array of strings).

This option allows you to set the theme for only inline code snippets. By default it inherits the theme from `options.theme`.
Do note that if a value is set for this, it stops inheriting all the themes from `options.theme`.

For example, let's say you have this configuration structure.

```javascript
const processor = await unified()
	.use(remarkParse)
	.use(remarkRehype)
	.use(rehypeHighlighter, {
		theme: ["dracula", "github-light"],
		inlineCode: {
			theme: ["github-dark"]
		}
	})
	.use(rehypeStringify)
	.process("YOUR MARKDOWN CODE");
```
The highlighter will only use `github-dark` for your inline code blocks.

**options.inlineCode.spaceSubstitution**  
Type: `Boolean` (True or False)

Becareful about the spelling of `spaceSubstitution`.
This option only applies to inline code. Svelte strips multiple whitespaces from elements and this can affect how your code is rendered when you choose to highlight inline code. What this option does is that,
when you set it to true, it replaces every whitespace with it's html entity `&nbps;`, this way, your whitespace is not stripped
and it's rendered.
