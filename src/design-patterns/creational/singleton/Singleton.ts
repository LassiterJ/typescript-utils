// This is a class that allows you to implement a Singleton design pattern on any class in TypeScript
// Expectations for this class::
  // 1. You should be able to create a Singleton of any class by extending Singleton
  // 2. You should be able to create a Singleton instance of any class by passing the class to the Singleton constructor which will then return the newly created instance
  // 3. You should be able to get all instances of all classes that have been instantiated as a Singleton
  // 4. You should be able to get a specific instance of a class that has been instantiated as a Singleton
  // 5. You should be able to clear all instances of all classes that have been instantiated as a Singleton
  // 6. You should be able to clear a specific instance of a class that has been instantiated as a Singleton
  // 7. You should not be able to make multiple instances of a class that has been instantiated as a Singleton
  // 8. Any class that has been instantiated as a Singleton should only be able to access the public Singleton class methods and properties
  // 9. Any class that has been instantiated as a Singleton should not be allowed to have more than one instance of itself


// class Foo extends Singleton<Foo> {}
// const foo1 = Foo.getInstance(); //
//
// OR This
// class Foo {}
// const MyClassSingleton = new Singleton(Foo);
// const foo1 = MyClassSingleton.getInstance();
//
// OR This
//
// class Foo {constructor(someOptionsObject) {}}
// const MyClassSingleton = new Singleton(Foo, someOptionsObject);
// const foo1 = MyClassSingleton.getInstance();

// example basic usage:
/* 1
  class Foo extends Singleton<Foo> {}
  const foo1 = Foo.getInstance();
 */
/* 2
  class Foo {}
  const MyClassSingleton = new Singleton(Foo);
  const foo1 = MyClassSingleton.getInstance();
*/
/* 3
  class Foo {constructor(someOptionsObject) {}}
  const MyClassSingleton = new Singleton(Foo, someOptionsObject);
  const foo1 = MyClassSingleton.getInstance();
*/
/* 4 // TODO:  Still playing with this one. Should an existing class instance be allowed to be made into a Singleton? If so, it can't be done in the constructor. Maybe a static method?
  class Foo {constructor(someOptionsObject) {}}
  const fooClassInstance = new Foo({foo: 'bar'});
  // TODO: Need to figure out if I can get the Singleton class to determine that the passed 'instance' is the only instance of the class. Otherwise it would be up to the user to decide if the instance is the only instance of the class and therefore is truly a Singleton.
  Singleton.makeSingleton(fooClassInstance);
 */

export type Constructor = new (...args: any[]) => any;
interface CallOrConstruct { // Found this in the TypeScript docs This will allow us to use the same function for both the constructor and the getInstance method
  new (s: string): Date;
  (n?: number): number;
}
export class Singleton<T extends Singleton<T>> {
  private static instances: Map<string, Singleton<any>> = new Map();
  // Constructor
  // Can be called:
  //      from super() in a derived class
  //      from the Singleton class

  // if this constructor is being called from a derived class, then return the derived class instance using Singleton.getInstance(derivedClass, ...args);
  // if this constructor is being called from the Singleton class, then call this.getInstance(derivedClass, ...args);
  //
  public constructor(private readonly derivedTypeArg?: Constructor, args?: any, options?: object){
    // if no derivedType is passed, or the arg is not a constructor, then the class extends Singleton and is the derivedType


   // Singleton.getInstance(derivedTypeArg, args);
  }

  public static getDerivedClass(arg, self){
    console.log("arg: ", arg);
    console.log("typeof arg: ", typeof arg);
    console.log("this: ", this);
    // If no arg is passed, or the arg is not a constructor, or the arg is the same as self, then the class extends Singleton and is the derivedType
    if (!arg || arg.prototype === self || typeof arg !== "function" ) { //
      console.log("getDerivedClass returning self: ", self);
      return self as Constructor;
    }


    return arg;
  };

  public static getInstance<T extends Singleton<T>>(derivedTypeArg?, args?: any): Singleton<T> {
    // If the derivedType is not passed, then the class extends Singleton and is the derivedType
    // Looks for instance of derivedType in the instances map
    // If it exists, then return it
    // If it doesn't exist, then create it and return it
    const derivedType = Singleton.getDerivedClass(derivedTypeArg, this);
    // If the derivedType is passed, then the class is not extending Singleton and is not the derivedType
    const typeName = derivedType.name;
    if (!Singleton.instances.has(typeName)) {
      console.log("Creating new Singleton instance: ", typeName);
      // TODO: Causing an infinite loop. Figure out why.
      const newInstance = args ? new derivedType(args): new derivedType();
      console.log("newInstance: ", newInstance);
      Singleton.instances.set(typeName, newInstance);
    }
    const foundInstance = Singleton.instances.get(typeName);
    console.log("foundInstance: ", foundInstance);

    if(!foundInstance){
      throw new Error(`Error: ${typeName} could not be instantiated`);
    }
    return foundInstance;

  }

  public static getAllSingletons(): Singleton<any>[] {
    return Array.from(Singleton.instances.values());
  }

  public static clearAllInstances(): void {
    Singleton.instances.clear();
  }

  public static clearInstance<T extends Singleton<T>>(instance: Singleton<T>): void {
    const typeName = instance.constructor.name;

    if (Singleton.instances.has(typeName) && Singleton.instances.get(typeName) === instance) {
      Singleton.instances.delete(typeName);
    }
  }
}



// export class Singleton<T extends Singleton<T>> {
//   private static instances: Set<Singleton<any>> = new Set();
//
//   public constructor() {
//     const derivedType = this.constructor as new () => T;
//     const typeName = derivedType.name;
//
//     if (Singleton.instances.has(this)) {
//       throw new Error(`Error: ${typeName} has already been instantiated`);
//     }
//
//     Singleton.instances.add(this);
//   }
//
//   public static getInstance(): Singleton<any> {
//     const derivedType = this as new () => T;
//
//     for (const instance of Singleton.instances) {
//       if (instance.constructor === derivedType) {
//         return instance;
//       }
//     }
//
//     const newInstance = new derivedType();
//     Singleton.instances.add(newInstance);
//     return newInstance;
//   }
//
//   public static getAllSingletons(): Singleton<any>[] { // May use a generic version of this in an abstract class to supply design patterns with common methods
//     return Array.from(Singleton.instances.values());
//   }
//   public static clearAllInstances(): void {
//     Singleton.instances.clear();
//   }
//   public static clearInstance(instance: Singleton<any>): void {
//     Singleton.instances.delete(instance);
//   }
// }
