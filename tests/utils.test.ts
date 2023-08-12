import { describe, it, expect } from "vitest";
import { parseInlineCode } from "../src/lib/utils";

describe("Testing parseInlindeCode utility", () => {
	it("returns original string if no match", () => {
		const str = "hello world";
		const result = parseInlineCode(str);
		expect(result).toEqual(str);
	});

	it("extracts token if present", () => {
		const str = ":token: rest of string";
		const result = parseInlineCode(str);
		expect(result).toEqual({ token: "token", content: " rest of string" });
	});

	it("returns object if no whitespace before token", () => {
		const str = ":token:";
		const result = parseInlineCode(str);
		expect(result).toEqual({ token: "token", content: "" });
	});

	it("handles non-word characters in token", () => {
		const str = ":token-2:";
		const result = parseInlineCode(str);
		expect(result).toEqual({ token: "token-2", content: "" });
	});

	it("handles escaped colon", () => {
		const str = "\\:nottoken:";
		const result = parseInlineCode(str);
		expect(result).toEqual(str);
	});

	it("handles colon mid string", () => {
		const str = "text: more text";
		const result = parseInlineCode(str);
		expect(result).toEqual(str);
	});

	it("handles empty string input", () => {
		const str = "";
		const result = parseInlineCode(str);
		expect(result).toEqual(str);
	});
});
