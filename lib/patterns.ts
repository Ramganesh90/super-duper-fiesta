import type { Pattern } from "./types";
import singleton from "@/data/patterns/singleton.json";
import factoryMethod from "@/data/patterns/factory-method.json";
import observer from "@/data/patterns/observer.json";
import abstractFactory from "@/data/patterns/abstract-factory.json";
import builder from "@/data/patterns/builder.json";
import prototype from "@/data/patterns/prototype.json";
import adapter from "@/data/patterns/adapter.json";
import bridge from "@/data/patterns/bridge.json";
import composite from "@/data/patterns/composite.json";
import decorator from "@/data/patterns/decorator.json";
import facade from "@/data/patterns/facade.json";
import flyweight from "@/data/patterns/flyweight.json";
import proxy from "@/data/patterns/proxy.json";
import strategy from "@/data/patterns/strategy.json";
import command from "@/data/patterns/command.json";
import iterator from "@/data/patterns/iterator.json";
import mediator from "@/data/patterns/mediator.json";
import memento from "@/data/patterns/memento.json";
import state from "@/data/patterns/state.json";
import templateMethod from "@/data/patterns/template-method.json";
import visitor from "@/data/patterns/visitor.json";
import chainOfResponsibility from "@/data/patterns/chain-of-responsibility.json";
import interpreter from "@/data/patterns/interpreter.json";
import objectPool from "@/data/patterns/object-pool.json";
import lazyInitialization from "@/data/patterns/lazy-initialization.json";
import multiton from "@/data/patterns/multiton.json";
import simpleFactory from "@/data/patterns/simple-factory.json";
import parameterizedConstructor from "@/data/patterns/parameterized-constructor.json";
import staticFactoryMethod from "@/data/patterns/static-factory-method.json";

const patterns = [
  singleton,
  factoryMethod,
  abstractFactory,
  builder,
  prototype,
  simpleFactory,
  staticFactoryMethod,
  parameterizedConstructor,
  multiton,
  objectPool,
  lazyInitialization,
  adapter,
  bridge,
  composite,
  decorator,
  facade,
  flyweight,
  proxy,
  chainOfResponsibility,
  command,
  interpreter,
  iterator,
  mediator,
  memento,
  observer,
  state,
  strategy,
  templateMethod,
  visitor,
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
