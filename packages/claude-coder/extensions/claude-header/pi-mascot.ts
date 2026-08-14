export type MascotPaint = {
	accent: (s: string) => string;
	muted: (s: string) => string;
};

export const PI_MASCOT_FRAME_COUNT = 5;
export const PI_MASCOT_WIDTH = 9;
export const PI_MASCOT_ROW_COUNT = 4;

// Claude Code's Clawd startup mascot.
const CLAWD = [" ▐▛███▜▌ ", "▝▜█████▛▘", "  ▘▘ ▝▝  "];

export function piMascotFrame(frameIndex: number, paint: MascotPaint): string[] {
	const frame = Math.max(0, Math.min(PI_MASCOT_FRAME_COUNT - 1, frameIndex));
	const top = frame - 3;
	const rows = Array.from({ length: PI_MASCOT_ROW_COUNT }, () => " ".repeat(PI_MASCOT_WIDTH));
	for (let i = 0; i < CLAWD.length; i++) {
		const row = top + i;
		if (row >= 0 && row < rows.length) rows[row] = CLAWD[i]!;
	}
	return rows.map(paint.accent);
}
