import type { AwsDomain, Segment } from "./types";
import week1 from "@/data/aws/segments/week-1.json";
import week2 from "@/data/aws/segments/week-2.json";
import week3 from "@/data/aws/segments/week-3.json";
import week4 from "@/data/aws/segments/week-4.json";
import week5 from "@/data/aws/segments/week-5.json";
import week6 from "@/data/aws/segments/week-6.json";
import week7 from "@/data/aws/segments/week-7.json";
import week8 from "@/data/aws/segments/week-8.json";
import week9 from "@/data/aws/segments/week-9.json";
import week10 from "@/data/aws/segments/week-10.json";
import week11 from "@/data/aws/segments/week-11.json";
import week12 from "@/data/aws/segments/week-12.json";
import week13 from "@/data/aws/segments/week-13.json";

// Ordered by week — the study plan is meant to be worked through in sequence.
const segments = [
  week1,
  week2,
  week3,
  week4,
  week5,
  week6,
  week7,
  week8,
  week9,
  week10,
  week11,
  week12,
  week13,
] as unknown as Segment[];

export function getAllSegments(): Segment[] {
  return segments;
}

export function getAllSegmentIds(): string[] {
  return segments.map((s) => s.id);
}

export function getSegmentById(id: string): Segment | undefined {
  return segments.find((s) => s.id === id);
}

export function getSegmentsByDomain(domain: AwsDomain): Segment[] {
  return segments.filter((s) => s.domain === domain);
}

// Sequential unlock: a segment is available once the previous week is mastered.
// Week 1 is always available. Returns the ordered list of segment ids per domain
// that must be mastered to earn a domain badge.
export function getSegmentIdsForDomain(domain: AwsDomain): string[] {
  return getSegmentsByDomain(domain).map((s) => s.id);
}
