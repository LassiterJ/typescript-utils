import {expect, describe, it, afterEach, beforeEach} from "@jest/globals";
import {Singleton} from "./Singleton";
describe('Singleton', () => {
  describe.each([
    ['class extending Singleton', class Foo extends Singleton<Foo> {}],
    ['class extending Singleton with constructor args', class Foo extends Singleton<Foo>  { constructor(options: any) {super(); Foo.getInstance()} }],
    ['class passed to constructor', class Foo {}],
    ['class passed to constructor with constructor args', class Foo { constructor(options: any) {} }],
  ])('%s', (desc, FooClass) => {
    let singleton: Singleton<any>;

    beforeEach((FooClass) => {
      console.log("FooClass: ", FooClass);

      // if FooClass extends Singleton, then we can use the getInstance method

      if (desc === 'class extending Singleton') {
        singleton = new FooClass();
      } else {
        singleton = new Singleton(FooClass as new (options?: any) => any);
      }
    });

    afterEach(() => {
      Singleton.clearAllInstances();
    });

    it('should create a Singleton instance', () => {
      const instance1 = singleton.getInstance();
      const instance2 = singleton.getInstance();
      expect(instance1).toBeInstanceOf(FooClass);
      expect(instance2).toBeInstanceOf(FooClass);
      expect(instance1).toEqual(instance2);
    });
    //
    // it('should throw an error if a Singleton instance has already been created', () => {
    //   singleton = new Singleton(FooClass);
    //   const instance1 = singleton.getInstance();
    //   expect(() => new FooClass()).toThrow(`${FooClass.name} has already been instantiated`);
    // });
    //
    // it('should not be able to create multiple instances of a Singleton', () => {
    //   singleton = new Singleton(FooClass);
    //   const instance1 = singleton.getInstance();
    //   const instance2 = singleton.getInstance();
    //   expect(() => new FooClass()).toThrow(`${FooClass.name} has already been instantiated`);
    //   expect(instance1).toEqual(instance2);
    // });
    //
    // it('should be able to clear a specific instance of a Singleton', () => {
    //   singleton = new Singleton(FooClass);
    //   const instance1 = singleton.getInstance();
    //   expect(singleton.getAllSingletons()).toHaveLength(1);
    //   singleton.clearInstance(instance1);
    //   expect(singleton.getAllSingletons()).toHaveLength(0);
    // });
    //
    // it('should be able to clear all instances of a Singleton', () => {
    //   singleton = new Singleton(FooClass);
    //   singleton.getInstance();
    //   expect(singleton.getAllSingletons()).toHaveLength(1);
    //   Singleton.clearAllInstances();
    //   expect(singleton.getAllSingletons()).toHaveLength(0);
    // });
  });
});
