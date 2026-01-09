export type Quarter = {
    year: number;
    q: number; // 1-4
};

export class TimeUtils {
    static parse(quarterStr: string): Quarter {
        // Expects "2024-Q1" or "2024Q1"
        const cleaned = quarterStr.replace("-", "").toUpperCase();
        const match = cleaned.match(/^(\d{4})Q(\d)$/);
        if (!match) {
            throw new Error(`Invalid quarter format: ${quarterStr}`);
        }
        return {
            year: parseInt(match[1]),
            q: parseInt(match[2]),
        };
    }

    static format(q: Quarter): string {
        return `${q.year}Q${q.q}`;
    }

    static toIndex(q: string | Quarter): number {
        const { year, q: quarter } = typeof q === "string" ? TimeUtils.parse(q) : q;
        return year * 4 + (quarter - 1);
    }

    static fromIndex(idx: number): string {
        const year = Math.floor(idx / 4);
        const q = (idx % 4) + 1;
        return TimeUtils.format({ year, q });
    }

    static diff(q1: string, q2: string): number {
        return TimeUtils.toIndex(q2) - TimeUtils.toIndex(q1);
    }

    static add(q: string, quarters: number): string {
        return TimeUtils.fromIndex(TimeUtils.toIndex(q) + quarters);
    }

    static generateRange(start: string, end: string): string[] {
        const sIdx = TimeUtils.toIndex(start);
        const eIdx = TimeUtils.toIndex(end);
        const range: string[] = [];
        for (let i = sIdx; i <= eIdx; i++) {
            range.push(TimeUtils.fromIndex(i));
        }
        return range;
    }
}
