// Class instantiation POC
const {expect, describe, it} = require("@jest/globals");
const {getObjectDetails, Singleton} = require( "./Singleton.js");


// Things that may be useful to use in this implementation
// this.target`
// Reflect.construct
// Reflect.apply

class SubClass1 extends Singleton {
  Foo = "Foo"
}

class SubClass2 extends Singleton {
  constructor(args) {
    super();
    const {foo = "bar"} = args ?? {};
    console.log("SubClass2: foo: ", foo);
    //SubClass2.getInstance()
  };
}

class SubClass3 {
}

class SubClass4 {
  constructor({foo}) {
    console.log("SubClass4: foo: ", foo)
  }
}

describe('Singleton and SubClasses', () => {
  let instancesWeakMap = new WeakMap();

  beforeEach(() => {
    instancesWeakMap = new WeakMap();
    Singleton.instances = instancesWeakMap;
   delete SubClass1.instance;
   delete SubClass2.instance;
   delete SubClass3.instance;
   delete SubClass4.instance;
  });


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
        const subClassNewSubClass2 = new SubClass2(null, {foo: 'test2'});
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
    });
  });
});