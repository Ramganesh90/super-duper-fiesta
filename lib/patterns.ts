import type { Pattern } from "./types";
import singleton from "@/data/patterns/singleton.json";
import factoryMethod from "@/data/patterns/factory-method.json";
import observer from "@/data/patterns/observer.json";
import abstractFactory from "@/data/patterns/abstract-factory.json";
import builder from "@/data/patterns/builder.json";
import prototype from "@/data/patterns/prototype.json";

const patterns = [
  singleton,
  factoryMethod,
  abstractFactory,
  builder,
  prototype,
  observer,
] as unknown as Pattern[];

export function getAllPatterns(): Pattern[] {
  return patterns;
}

export function getAllPatternIds(): string[] {
  return patterns.map((p) => p.id);
}

export function getPatternById(id: string): Pattern | undefined {
  return patterns.find((p) => p.id === id);
}

export function getPatternsByCategory(category: Pattern["category"]): Pattern[] {
  return patterns.filter((p) => p.category === category);
}
