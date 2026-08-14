import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export type AutoThinkingLevel = "minimal" | "low" | "medium" | "high";

const HARD = /\b(architecture|design|migration|refactor|security|auth|permission|secret|concurrency|race|transaction|rollback|data loss|breaking change|think hard|carefully)\b/i;
const TRIVIAL = /\b(typo|spelling|rename|formatting|one[- ]line|tiny change)\b/i;

// ponytail: local keyword heuristic; replace with a local classifier only if misroutes become measurable.
export function classifyTask(prompt: string, hasImages = false): AutoThinkingLevel {
	const text = prompt.trim();
	if (TRIVIAL.test(text) && !HARD.test(text)) return "minimal";

	let score = 0;
	if (/\b(quick|brief|concise|translate|summari[sz]e|simple explanation)\b/i.test(text)) score--;
	if (/\b(implement|add|update|change|modify|build|write|fix|debug|error|exception|failing|broken)\b/i.test(text)) score += 2;
	if (/\b(test|tests|lint|typecheck|CI)\b/i.test(text)) score++;
	if (HARD.test(text)) score += 3;
	if (text.includes("```")) score++;
	if (text.split(/\s+/).filter(Boolean).length >= 120) score++;
	if (hasImages) score++;

	if (score < 0) return "minimal";
	if (score === 0) return "low";
	if (score < 3) return "medium";
	return "high";
}

export default function autoThinking(pi: ExtensionAPI): void {
	pi.on("before_agent_start", (event, ctx) => {
		const level = ctx.model?.reasoning
			? classifyTask(event.prompt, (event.images?.length ?? 0) > 0)
			: "off";
		pi.setThinkingLevel(level);
		ctx.ui.setStatus("auto-thinking", `auto ${level}`);
	});
}
