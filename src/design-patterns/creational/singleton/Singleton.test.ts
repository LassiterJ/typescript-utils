import {expect, describe, it, afterEach, beforeEach} from "@jest/globals";
import {Singleton} from "./Singleton";
type ConstructorWithAnyArgs = new (...args: any[]) => any;
describe('Singleton', () => {
  let singleton: Singleton<any>;
  class Foo1 extends Singleton<Foo1> {}
  class Foo2 extends Singleton<Foo2>  { constructor({foo}) {super(); console.log("Foo2: foo: ", foo); Foo2.getInstance()}}
  class Foo3 {}
  class Foo4 { constructor({foo}) {console.log("Foo2: foo: ", foo);} }

  // const cases : [string, typeof Foo1 | typeof Foo2 | typeof Foo3 | typeof Foo4][] = [
  const cases : [string, ConstructorWithAnyArgs][] = [
    ['class extending Singleton', Foo1],
    ['class extending Singleton with constructor args', Foo2],
    ['class passed to constructor', Foo3],
    ['class passed to constructor with constructor args', Foo4]
];
    describe.each(cases)("%s", (description, FooClass) => {
      // Determine if the class extends Singleton
      console.log("FooClass: ", FooClass);
      // const isSingletonSubClass = FooClass.prototype instanceof Singleton;
      // if(typeof FooClass !== "string") {
      //   const isSingletonSubClass = FooClass.prototype instanceof Singleton;
      //   console.log("isSingleton: ", isSingletonSubClass);
      // }
    let singleton;
    let fooClass;
      console.log("description: ", description);
      console.log("FooClass: ", FooClass);
      beforeEach(() => {
        fooClass = FooClass;
        if(description === "class extending Singleton") {
          // @ts-ignore
          singleton = FooClass.getInstance()
        } else if(description === "class extending Singleton with constructor args") {
          console.log("class extending Singleton with constructor args: ", FooClass)
          // @ts-ignore
          singleton = FooClass.getInstance();
        } else if(description === "class passed to constructor") {
          singleton = new Singleton(FooClass);
        } else if(description === "class passed to constructor with constructor args") {
          singleton = new Singleton(FooClass, {foo: "bar"} );
        }
        console.debug('singleton: ', singleton);

      });

      afterEach(() => {
        Singleton.clearAllInstances();
      });


      it('should create a Singleton instance', () => {
        console.log("singleton: ", singleton);

        const instance1 = fooClass.getInstance();
        const instance2 = fooClass.getInstance();
        expect(instance1).toBeInstanceOf(FooClass);
        expect(instance2).toBeInstanceOf(FooClass);
        expect(instance1).toEqual(instance2);
      });
    });
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
