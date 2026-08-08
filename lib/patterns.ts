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
import activeObject from "@/data/patterns/active-object.json";
import reactor from "@/data/patterns/reactor.json";
import proactor from "@/data/patterns/proactor.json";
import monitorObject from "@/data/patterns/monitor-object.json";
import threadPool from "@/data/patterns/thread-pool.json";
import filterCriteria from "@/data/patterns/filter-criteria.json";
import privateClassData from "@/data/patterns/private-class-data.json";
import viewHelper from "@/data/patterns/view-helper.json";
import dataMapper from "@/data/patterns/data-mapper.json";
import mvc from "@/data/patterns/mvc.json";
import mvp from "@/data/patterns/mvp.json";
import mvvm from "@/data/patterns/mvvm.json";
import layeredArchitecture from "@/data/patterns/layered-architecture.json";
import microkernel from "@/data/patterns/microkernel.json";
import soa from "@/data/patterns/soa.json";
import cqrs from "@/data/patterns/cqrs.json";
import dependencyInjection from "@/data/patterns/dependency-injection.json";
import inversionOfControl from "@/data/patterns/inversion-of-control.json";
import serviceLocator from "@/data/patterns/service-locator.json";
import repository from "@/data/patterns/repository.json";
import unitOfWork from "@/data/patterns/unit-of-work.json";
import dao from "@/data/patterns/dao.json";
import businessDelegate from "@/data/patterns/business-delegate.json";

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
  privateClassData,
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
  filterCriteria,
  activeObject,
  reactor,
  proactor,
  monitorObject,
  threadPool,
  viewHelper,
  dataMapper,
  mvc,
  mvp,
  mvvm,
  layeredArchitecture,
  microkernel,
  soa,
  cqrs,
  dependencyInjection,
  inversionOfControl,
  serviceLocator,
  repository,
  unitOfWork,
  dao,
  businessDelegate,
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
