import {expect, describe, it, afterEach, beforeEach} from "@jest/globals";
import {Singleton} from "./Singleton";
// type ConstructorWithAnyArgs = new (...args: any[]) => any;
// describe('Singleton', () => {
//   let singleton: Singleton<any>;
//   class Foo1 extends Singleton<Foo1> {}
//   class Foo2 extends Singleton<Foo2>  { constructor({foo}) {super(); console.log("Foo2: foo: ", foo); Foo2.getInstance()}}
//   class Foo3 {}
//   class Foo4 { constructor({foo}) {console.log("Foo2: foo: ", foo);} }
//
//   // const cases : [string, typeof Foo1 | typeof Foo2 | typeof Foo3 | typeof Foo4][] = [
//   const cases : [string, ConstructorWithAnyArgs][] = [
//     ['class extending Singleton', Foo1],
//     ['class extending Singleton with constructor args', Foo2],
//     ['class passed to constructor', Foo3],
//     ['class passed to constructor with constructor args', Foo4]
// ];
//     describe.each(cases)("%s", (description, FooClass) => {
//       // Determine if the class extends Singleton
//       console.log("FooClass: ", FooClass);
//       // const isSingletonSubClass = FooClass.prototype instanceof Singleton;
//       // if(typeof FooClass !== "string") {
//       //   const isSingletonSubClass = FooClass.prototype instanceof Singleton;
//       //   console.log("isSingleton: ", isSingletonSubClass);
//       // }
//     let singleton;
//     let fooClass;
//       console.log("description: ", description);
//       console.log("FooClass: ", FooClass);
//       beforeEach(() => {
//         fooClass = FooClass;
//         if(description === "class extending Singleton") {
//           // @ts-ignore
//           singleton = FooClass.getInstance()
//         } else if(description === "class extending Singleton with constructor args") {
//           console.log("class extending Singleton with constructor args: ", FooClass)
//           // @ts-ignore
//           singleton = FooClass.getInstance();
//         } else if(description === "class passed to constructor") {
//           singleton = new Singleton(FooClass);
//         } else if(description === "class passed to constructor with constructor args") {
//           singleton = new Singleton(FooClass, {foo: "bar"} );
//         }
//         console.debug('singleton: ', singleton);
//
//       });
//
//       afterEach(() => {
//         Singleton.clearAllInstances();
//       });
//
//       it('should create a Singleton instance', () => {
//         console.log("singleton: ", singleton);
//
//         const instance1 = fooClass.getInstance();
//         const instance2 = fooClass.getInstance();
//         expect(instance1).toBeInstanceOf(FooClass);
//         expect(instance2).toBeInstanceOf(FooClass);
//         expect(instance1).toEqual(instance2);
//       });
//     });
// });
//


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


// Things that may be useful to use in this implementation
// this.target`
// Reflect.construct
// Reflect.apply

class SubClass1 extends Singleton<SubClass1> {
  Foo = "Foo"
}

class SubClass2 extends Singleton<SubClass2> {
  constructor({foo = "bar"}) {
    super();
  };
}

class SubClass3 {
}

class SubClass4 {
  public foo;
  constructor({foo}) {
    this.foo = foo;
  }
}

describe('Singleton and SubClasses', () => {
  let instancesMap = new Map();
  let count = 0;
  let hasIsCreatingInstanceBeenSetToTrue = false;
  beforeEach(() => {

    class SubClass1 extends Singleton<SubClass1> {
      Foo = "Foo"
    }

    // class SubClass2 extends Singleton<SubClass2> {
    //   public foo;
    //   constructor(args) {
    //     super();
    //     const {foo = "bar"} = args ?? {};
    //   };
    // }
    //
    // class SubClass3 {
    // }
    //
    // class SubClass4 {
    //   public foo;
    //   constructor({foo}) {
    //     this.foo = foo;
    //   }
    // }

    instancesMap = new Map();
    Singleton.instances = instancesMap;
    // const subClassesArr = [SubClass1, SubClass2, SubClass3, SubClass4];
    // const isCreatingInstanceValues = {  // meh i'll just use this for now
    //   SubClass1: SubClass1.isCreatingInstance,
    //   SubClass2: SubClass2.isCreatingInstance,
    //   SubClass3: SubClass3.isCreatingInstance,
    //   SubClass4: SubClass4.isCreatingInstance
    // }
    // subClassesArr.forEach((subClass) => {
    //   if(subClass.instance){
    //     subClass.instance = null;
    //   }
    //   if(!!subClass.isCreatingInstance){
    //       console.log(`isCreatingInstanceValues #${count}: `, isCreatingInstanceValues);
    //       console.log(`this: `, this);
    //       hasIsCreatingInstanceBeenSetToTrue = true;
    //       subClass.isCreatingInstance;
    //   }
    //   if(subClass.constructor === SubClass3 || subClass.constructor === SubClass4){
    //     delete subClass.isCreatingInstance;
    //   }
    // });
    // count++;
  });

  type SubClass3Type = typeof SubClass3 & {
    instance: Singleton<SubClass3>;
  };
  type SubClass4Type = typeof SubClass4 & {
    instance: Singleton<SubClass4>;
  };
  describe('SubClass extends Singleton', () => {
    describe('SubClass1', () => {
      it('should be able to be able to be instantiated with `new` keyword', () => {
        const subClass = new SubClass1();
        const subClassAgain = new SubClass1();
        const anotherSubClass = new Singleton(SubClass1);
        expect(subClass).toBeInstanceOf(SubClass1);
        expect(subClass).toBeInstanceOf(Singleton);
        expect(subClass).toBe(SubClass1.instance);

        expect(subClassAgain).toBeInstanceOf(SubClass1);
        expect(subClassAgain).toBeInstanceOf(Singleton);
        expect(subClassAgain).toBe(SubClass1.instance);

        expect(subClass).toBe(subClassAgain);
        expect(anotherSubClass).toBeInstanceOf(SubClass1);
        expect(subClass).toBe(anotherSubClass);

      });
      it('should be able to be instantiated without new keyword', () => {
        const subClass1 = SubClass1.getInstance();
        const anotherSubClass1 = new SubClass1();

        expect(subClass1).toBeInstanceOf(SubClass1);
        expect(anotherSubClass1).toBeInstanceOf(SubClass1);
        expect(subClass1).toBeInstanceOf(Singleton);
        expect(anotherSubClass1).toBeInstanceOf(Singleton);
        expect(subClass1).toBe(anotherSubClass1); // TODO: Do we want the reference to be the same or just deep equality or just the type?
      });
      it('should be able to be instantiated by the Singleton', () => {
        const subClass1 = Singleton.getInstance(SubClass1);
        const subClass1Again = Singleton.getInstance(SubClass1);
        const anotherSubClass1 = new SubClass1();
        const anotherSubClass1Again = new SubClass1();

        expect(subClass1).toBeInstanceOf(SubClass1);
        expect(anotherSubClass1).toBeInstanceOf(SubClass1);
        expect(anotherSubClass1Again).toBeInstanceOf(SubClass1);
        expect(subClass1Again).toBeInstanceOf(SubClass1);
        expect(subClass1).toBe(subClass1Again);
        expect(subClass1).toBe(anotherSubClass1Again);
        expect(subClass1).toBe(anotherSubClass1);
      });

      it('should return the same instance when multiple instances are created with SubClass.getInstance', () => {
        const subClass1 = SubClass1.getInstance();
        const anotherSubClass1 = SubClass1.getInstance();

        expect(subClass1).toBe(anotherSubClass1);
      });

      it('should return the same instance when multiple instances are created with Singleton.getInstance', () => {
        const subClass1 = Singleton.getInstance(SubClass1);
        const anotherSubClass1 = Singleton.getInstance(SubClass1);

        expect(subClass1).toBe(anotherSubClass1);
      });
    });
    describe('SubClass2', () => {
      it('should be able to be able to be instantiated with `new` keyword', () => {
        const subClass2 = new SubClass2({foo: "bar"});
        expect(subClass2).toBeInstanceOf(SubClass2);
        expect(subClass2).toBeInstanceOf(Singleton);
      });
      it('should be able to be instantiated without new keyword', () => {
        const subClass2 = SubClass2.getInstance();
        const anotherSubClass2 = new SubClass2({foo: "bar"});
        expect(subClass2).toBeInstanceOf(SubClass2);
        expect(anotherSubClass2).toBeInstanceOf(SubClass2);
        expect(subClass2).toBe(anotherSubClass2);
      });
      it('should be able to be instantiated by the Singleton', () => {
        const subClass2 = Singleton.getInstance(SubClass2);
        const anotherSubClass2 = new SubClass2({foo: "bar"});
        expect(subClass2).toBeInstanceOf(SubClass2);
        expect(anotherSubClass2).toBeInstanceOf(SubClass2);
        expect(subClass2).toBe(anotherSubClass2);
      });
      it('should return the same instance when multiple instances are created with SubClass.getInstance', () => {
        const subClass2 = SubClass2.getInstance();
        const anotherSubClass2 = SubClass2.getInstance();
        expect(subClass2).toBe(anotherSubClass2);
      });

      it('should return the same instance when multiple instances are created with Singleton.getInstance', () => {
        const subClass2 = Singleton.getInstance(SubClass2);
        const anotherSubClass2 = Singleton.getInstance(SubClass2);
        expect(subClass2).toBe(anotherSubClass2);
      });
    });
    describe('SubClass3 and SubClass4 can be passed to Singleton constructor and instantiated there', () => {
      describe('SubClass3', () => {
        // TODO: Should this be able to be instantiated with new keyword?
        // If it should, then we should also test using the Singleton.getInstance method directly
        it('should be able to create a new instance of SubClass3 using the `new` keyword', () => {
          // TODO: Testing getDetails to see why the type cannot be derived.
          const subClass3 = new Singleton(SubClass3);
          expect(subClass3).toBeInstanceOf(SubClass3);
        });
        it('should be able to create a new instance of SubClass3 using the `Singleton.getInstance` static method', () => {
          const subClass3 = Singleton.getInstance(SubClass3);
          expect(subClass3).toBeInstanceOf(SubClass3);
        });
        it('should return the same instance when multiple instances are created', () => {
          const subClass3 = new Singleton(SubClass3);
          const anotherSubClass3 = new Singleton(SubClass3);
          expect(subClass3).toBe(anotherSubClass3);
        });
      });
      describe('SubClass4', () => {
        it('should be able to create a new instance of SubClass4', () => {
          const subClass4 = new Singleton(SubClass4, {foo: 'test'});
          expect(subClass4).toBeInstanceOf(SubClass4);
        });
        it('should be able to create a new instance of SubClass4 using the `Singleton.getInstance` static method', () => {
          const subClass4 = Singleton.getInstance(SubClass4, {foo: 'test'});
          expect(subClass4).toBeInstanceOf(SubClass4);

        });
        it('should return the same instance when multiple instances are created', () => {
          const subClass4 = new Singleton(SubClass4, {foo: 'test'});
          const anotherSubClass4 = new Singleton(SubClass4, {foo: 'test'});
          expect(subClass4).toBe(anotherSubClass4);
        });
      });

    });
    describe('Other Cases', () => {
      it('should be able to make multiple Singletons from multiple classes using all methods of instantiation', () => {
        const subClass1 = new Singleton(SubClass1);
        const subClass2 = new Singleton(SubClass2, {foo: 'test'});
        const subClass3 = new Singleton(SubClass3);
        const subClass4 = new Singleton(SubClass4, {foo: 'test'});

        expect(subClass1).toBeInstanceOf(SubClass1);
        expect(subClass2).toBeInstanceOf(SubClass2);
        expect(subClass3).toBeInstanceOf(SubClass3);
        expect(subClass4).toBeInstanceOf(SubClass4);

        const subClassNewSubClass1 = new SubClass1();
        const subClassNewSubClass2 = new SubClass2( {foo: 'test2'});
        const subClassNewSubClass3 = new SubClass1(SubClass3);
        const subClassNewSubClass4 = new SubClass1(SubClass4, {foo: 'test4'});

        expect(subClassNewSubClass1).toBeInstanceOf(SubClass1);
        expect(subClassNewSubClass2).toBeInstanceOf(SubClass2);
        expect(subClassNewSubClass3).toBeInstanceOf(SubClass3);
        expect(subClassNewSubClass4).toBeInstanceOf(SubClass4);

        expect(subClass1).toBe(subClassNewSubClass1);
        expect(subClass2).toBe(subClassNewSubClass2);
        expect(subClass3).toBe(subClassNewSubClass3);
        expect(subClass4).toBe(subClassNewSubClass4);

        const subClassSingletonGetInstanceSubClass1 =  Singleton.getInstance(SubClass1);
        const subClassSingletonGetInstanceSubClass2 =  Singleton.getInstance(SubClass2, {foo: 'test2'});
        const subClassSingletonGetInstanceSubClass3 =  Singleton.getInstance(SubClass3);
        const subClassSingletonGetInstanceSubClass4 =  Singleton.getInstance(SubClass4, {foo: 'test4'});

        expect(subClassSingletonGetInstanceSubClass1).toBeInstanceOf(SubClass1);
        expect(subClassSingletonGetInstanceSubClass2).toBeInstanceOf(SubClass2);
        expect(subClassSingletonGetInstanceSubClass3).toBeInstanceOf(SubClass3);
        expect(subClassSingletonGetInstanceSubClass4).toBeInstanceOf(SubClass4);

        expect(subClass1).toBe(subClassSingletonGetInstanceSubClass1);
        expect(subClass2).toBe(subClassSingletonGetInstanceSubClass2);
        expect(subClass3).toBe(subClassSingletonGetInstanceSubClass3);
        expect(subClass4).toBe(subClassSingletonGetInstanceSubClass4);
        // expect(subClass4).toBeInstanceOf(SubClass4);
      });
      describe('Garbage Control and instance setting', () => {
        beforeEach(() => {
          Singleton.clearAllInstances();
          setTimeout(() => {
            // Wait for the WeakRef to be cleared
          }, 100);
        });

        describe('instance getter', () => {
          it('should get the instance of the Singleton class', () => {
            expect(Singleton.instance).toBeNull();

            const instance = Singleton.getInstance(SubClass1);
            expect(SubClass1.instance).toBe(instance);
          });
        });

        describe('instance setter', () => {
          it('should set the instance of the Derived class', () => {
            const instance1 = Singleton.getInstance(SubClass1);
            expect(SubClass1.instance).toBe(instance1);

            const instance2 = new Singleton(SubClass1);
            SubClass1.instance = instance2;
            expect(SubClass1.instance).toBe(instance2);
          });

          it('should throw an error when setting an invalid value', () => {
            expect(() => { SubClass1.instance = 'invalid value'; }).toThrow(Error);
          });

          it('should use a WeakRef for the instance', () => {
            const instance = Singleton.getInstance(SubClass1);
            expect(SubClass1.instance).toEqual(instance);

            let weakRef = new WeakRef(instance);
            instance.foo = 'bar';
            instance.baz = 'qux';
            expect(weakRef.deref()).toEqual(instance);

            SubClass1.instance = null;
            setTimeout(() => { //  Set timeout to allow the WeakRef to be cleaned up because we don't know when the garbage collector will run or even if it will cleanup the WeakRef. This behavior is non-deterministic.
              expect(weakRef.deref()).toBeNull()
            }, 1000);
          });
        });
        describe('clearAllInstances', () => {
          it('should clear all instances of all Singletons', () => {
            const instance1 = Singleton.getInstance(SubClass1);
            const instance2 = Singleton.getInstance(SubClass2);
            const instance3 = Singleton.getInstance(SubClass3);
            const instance4 = Singleton.getInstance(SubClass4);

            expect(SubClass1.instance).toBe(instance1);
            expect(SubClass2.instance).toBe(instance2);

            expect((SubClass3 as SubClass3Type).instance).toBe(instance3);
            expect((SubClass4 as SubClass4Type).instance).toBe(instance4);

            Singleton.clearAllInstances();
            setTimeout(() => { //
              expect(SubClass1.instance).toBeNull();
              expect(SubClass2.instance).toBeNull();
              expect((SubClass3 as SubClass3Type).instance).toBeNull();
              expect((SubClass4 as SubClass4Type).instance).toBeNull();
            }, );
          });
        });
        describe(' clearInstance', () => {
          it('should clear the instance of the Singleton class', () => {
            const instance1 = Singleton.getInstance(SubClass1);
            const instance2 = Singleton.getInstance(SubClass2);
            const instance3 = Singleton.getInstance(SubClass3);
            const instance4 = Singleton.getInstance(SubClass4);

            expect(SubClass1.instance).toBe(instance1);
            expect(SubClass2.instance).toBe(instance2);
            expect((SubClass3 as SubClass3Type).instance).toBe(instance3);
            expect((SubClass4 as SubClass4Type).instance).toBe(instance4);

            SubClass1.clearInstance();
            SubClass2.clearInstance();
            Singleton.clearInstance(SubClass3);
            Singleton.clearInstance(SubClass4);

            setTimeout(() => { //
              expect(SubClass1.instance).toBeNull();
              expect(SubClass2.instance).toBeNull();
              expect((SubClass3 as SubClass3Type).instance).toBeNull();
              expect((SubClass4 as SubClass4Type).instance).toBeNull();
            },1 );
          });
        });
        describe('events', () => {
          it('should emit an event when the instance is set', () => {

          });
        });
        // describe('createExtendedClass', () => {
        //   it('should create a new class that extends the Singleton class', () => {
        //     const ExtendedClass = Singleton.createExtendedClass({superClass: Singleton, derivedClass: SubClass4, thisVal:this, passedArgs: [{foo:"bar"}]});
        //     expect(ExtendedClass).toBeInstanceOf(Function);
        //     expect(ExtendedClass).toBeInstanceOf(Singleton);
        //   });
        // });
      });
    });
  });
  if(hasIsCreatingInstanceBeenSetToTrue) {
    console.log("hasIsCreatingInstanceBeenSetToTrue: ", hasIsCreatingInstanceBeenSetToTrue);
  }
});
