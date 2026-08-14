import assert from "node:assert/strict";
import test from "node:test";
import { classifyTask } from "./index.ts";

test("classifies representative task difficulty", () => {
	assert.equal(classifyTask("Translate this sentence briefly"), "minimal");
	assert.equal(classifyTask("Fix the typo in README.md"), "minimal");
	assert.equal(classifyTask("Implement a color option in src/theme.ts"), "medium");
	assert.equal(classifyTask("Debug the intermittent authentication race condition and failing tests carefully"), "high");
});
