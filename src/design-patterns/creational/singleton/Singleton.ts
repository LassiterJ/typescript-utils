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
interface SingletonOptions {
  madeWithNewKeyword: boolean;
  createExtendedClass: boolean;
  // dangerAllowAlterPrototype: false,
  // enforceSingletonByPrototype: false,
  // enforceNewKeyword: true,
  // implementationMethod: "prototype",
}
// interface SingletonEvents {
//   instanceCreated: (instance: any) => void;
//   instanceCleared: (instance: any) => void;
//   instanceClearedAll: (instance: any) => void;
//   instanceClearedAllClasses: (instance: any) => void;
//   instanceClearedAllInstances: (instance: any) => void;
//
// }
type Constructor = new (...args: any[]) => any;
type SingletonArgs = any[];
interface ProcessedSingletonArgs {
  classRef: Constructor,
  classArgs: any[],
  options: SingletonOptions
}

type ClassInstance<T extends new (...args: any[]) => any> = InstanceType<T>;

export class Singleton<T> {
  static instances: Map<WeakRef<ClassInstance>, ClassInstance> = new Map();
  static instanceRef: WeakRef<ClassInstance> | null = null;
  static isCreatingInstance: boolean = false;
  static events: Map<string, ((...args: any[]) => void)[]> = new Map(); // Map of event names to arrays of events;
  static singletonDefaultOptions: SingletonOptions = {
    madeWithNewKeyword: false,
    createExtendedClass: false,
  };
  constructor(...args: any[]) { //classRef = null, classArgs = [], options = {} || {classRef, classArgs, ...options}
    /*
        Our constructor is responsible for determining what the derived class is from either a passed in reference or the calling class.
       This reference is then passed to the getInstance method to get or create the instance of the derived class
       We will also pass in the args and options to the getInstance method
    */
    const {classRef, classArgs, options} = Singleton.processArgs({args, thisVal: this});

    /* Assign ref the given derivedClass. If the derivedClass is not passed, then if new.target is valid ref = this. This will be further validated in getInstance  */
    const isNewTargetValid = new.target === this.constructor && new.target !== Singleton;
    const isDerivedClassValid = classRef && !Array.isArray(classRef) && classRef !== Singleton;
    options.madeWithNewKeyword = isNewTargetValid && true;
    const ref = isDerivedClassValid ? classRef: (isNewTargetValid && this);

    /* Get instance and return it  */
    const instance = Singleton.getInstance(ref, classArgs || [], options);
    if(!instance){
      console.error("No instance was returned from getInstance");
      throw new Error("No instance was returned from getInstance");
    }
    return instance;
  }
  static get instance(): ClassInstance<any> | null | undefined  {
    const ref: WeakRef<ClassInstance<any>> | null | undefined = this.instanceRef;
    return ref && ref.deref();
  }
  static set instance(value) {
    if(!value){
      this.instanceRef = null;
      return;
    }
    const weakInstance = new WeakRef(value);
    Singleton.instances.set(weakInstance, value);
    this.instanceRef = weakInstance;
    Singleton.#finalizerRegistry.register(weakInstance, null);
  }
  /* The main function of our class. getInstance creates, gets, and sets instances */
  static getInstance(...args: any []): ClassInstance<any> | null | undefined {
    // step 1: Process and validate the arguments
    const {classRef, classArgs, options = {}} = Singleton.processArgs({args, thisVal: this});
    const isInstanceOfAClass = Singleton.#isVariableInstanceOfAClass(classRef);
    const isNewInstance = isInstanceOfAClass && (classRef !== classRef?.constructor?.instance);

    const newInstance = isNewInstance ? classRef : null;
    const existingInstance = isInstanceOfAClass ? classRef.constructor?.instance: classRef.instance;
    const refConstructor = isInstanceOfAClass ? classRef.constructor : classRef;
    const isDerivedFromSingleton = isInstanceOfAClass? classRef instanceof Singleton: classRef.prototype instanceof Singleton;
    const instanceInProcess = options.madeWithNewKeyword || !!refConstructor?.isCreatingInstance;
    const shouldCreateInstance = !newInstance && !existingInstance;

    if (!refConstructor) {
      throw new Error("refType could not be derived");
    }

    /* If there is an instance of the derived class already, and it's either a placeholder or has been created with the 'new' keyword, then this instance is already in the process of being created.  In this case, set the refConstructor to the instance and  return the instance.*/
    if(instanceInProcess){
      return !existingInstance ? refConstructor.instance = newInstance: existingInstance; // no need to set instance if the process has already started
    }

    /* If there is an instance of the derived class found, and we're not in the process of setting the instance already then go ahead and return the found instance*/
    if (existingInstance && !instanceInProcess){
      return existingInstance;
    }

    if(shouldCreateInstance){
      let constructorFunction = refConstructor;
      // const {createExtendedClass} = options;
      // if(createExtendedClass && !isDerivedFromSingleton){
      //   // use the createExtendedClass method to create a new class that extends the features of the  Singleton class as well as those of the passed class. The new class has with the prototype of the passed class.
      //   const extendedClass = Singleton.createExtendedClass({superClass: Singleton, derivedClass: classRef, classArgs, thisVal: this});
      //   constructorFunction = extendedClass;
      // }
      constructorFunction.isCreatingInstance = true;
      const instance = new constructorFunction(classArgs);
      if (instance){
        constructorFunction.isCreatingInstance = false;

        options.onInstanceCreated(instance);

        return constructorFunction.instance = instance;
      }
    }
    /* Else set the instance and return it */
    if(!newInstance){
      throw new Error("Could not get instance Please check to see if you are passing in a valid class reference or are using a class from the Singleton inheritance chain.");
    }
    // return Singleton.#setInstance(refConstructor, newInstance);
    return refConstructor.instance = newInstance;
  }
  static getAllInstances(): [WeakRef<ClassInstance>, ClassInstance][] | null | undefined {
    const instances = Singleton.instances && Array.from(Singleton.instances);
    console.log("getAllInstances| instances: ", instances);
    return instances;
  }
  static clearAllInstances: () => void = () => {
    // This won't directly remove instances that have been set on the static instance property of the target class; Those are WeakRefs, they will be removed when the target class is garbage collected.
    Singleton.instances = new Map();
    Singleton.instance = null; // Singleton.instance should never be se but just in case.
  }
  // static clearAllInstancesAsync = async() => {};

  static clearInstance: (ref?: ClassInstance) => void = (ref = this as any) => {
    if(!ref){
      return;
    }
    const isInstanceOfAClass = Singleton.#isVariableInstanceOfAClass(ref) && !ref.instance; // TODO: this might not work if the ref is a class that extends Singleton
    const refConstructor: object = isInstanceOfAClass ? ref: ref.constructor;
    if(!refConstructor){
      return;
    }
    refConstructor.instance = null;
    Singleton.instances.delete(refConstructor);
  };
  // static clearInstanceAsync = async(ref) => {};
  static processArgs= ({args, thisVal}):ProcessedSingletonArgs => {
    if((!args || !args.length) && (!thisVal || thisVal === Singleton)){
      return;
    }
    const [arg1, arg2, arg3] = args;
    let isFirstArgSingletonOptions = false;
    if(!arg1 && (thisVal === Singleton)){ // specifically checking for the Singleton class and not a derived class
      throw new Error("refArg is required when calling getInstance from the Singleton class");
    }
    if(typeof arg1 === "object" && !arg2 && arg1?.classRef){
      isFirstArgSingletonOptions = true;
    }
    const ref = arg1 || thisVal;
    /*  Merge given initial options with default options */
    const givenOptions = isFirstArgSingletonOptions ? arg1 : arg3;
    const mergedOptions = {...Singleton.singletonDefaultOptions, ...givenOptions};

    return {
      classRef: isFirstArgSingletonOptions ? ref?.classRef : ref,
      classArgs: isFirstArgSingletonOptions ? arg1?.classArgs : arg2,
      options: mergedOptions
    }
  };
  static on: (event: string, callback: (...args: any[]) => void) => void = (event, callback) => (event, callback) => {
    if(!event || !callback){
      return;
    }
    const eventCallbacks = this.events.get(event) || [];
    eventCallbacks.push(callback);
    this.events.set(event, eventCallbacks);
  }
  static off: (event: string, callback: (...args: any[]) => void) => void = (event, callback) => (event, callback) => {
    if(!event || !callback){
      return;
    }
    const eventCallbacks = this.events.get(event) || [];
    const newEventCallbacks = eventCallbacks.filter(cb => cb !== callback);
    this.events.set(event, newEventCallbacks);
  }
  static emit: (event: string, ...args: any[]) => void = (event, ...args) => (event, ...args) =>{
    if(!event){
      return;
    }
    const eventCallbacks = this.events.get(event) || [];
    eventCallbacks.forEach(cb => cb(...args));
  }
  // static createExtendedClass = ({superClass, derivedClass, thisVal, passedArgs, ...restArgs}) => {
  //   const extendedClass = function(...args) {
  //     Reflect.construct(superClass,[] );
  //     Reflect.construct(derivedClass, passedArgs );
  //   };
  //
  //   Object.setPrototypeOf(extendedClass.prototype, derivedClass.prototype);
  //   Object.setPrototypeOf(extendedClass, derivedClass);
  //   return extendedClass;
  // }
  static #finalizerRegistry = new FinalizationRegistry(key => {
    const instance = Singleton.instances.get(key);
    if (instance) {
      Singleton.clearInstance(instance);
    }
  });
  static #isVariableInstanceOfAClass = (ref) => {
    // TODO: Clean this up
    if(!ref){
      return false;
    }
    if (typeof ref !== "object") {
      return false;
    }

    if (ref.constructor === Object || ref.constructor === Array) {
      return false;
    }

    if (Object.getPrototypeOf(ref) === null) {
      return false;
    }
    return (ref?.constructor?.name !== "");

  }
}
export default Singleton;
// export type Constructor = new (...args: any[]) => any;
// interface CallOrConstruct { // Found this in the TypeScript docs This will allow us to use the same function for both the constructor and the getInstance method
//   new (s: string): Date;
//   (n?: number): number;
// }
// export class Singleton<T extends Singleton<T>> {
//   private static instances: Map<string, Singleton<any>> = new Map();
//   // Constructor
//   // Can be called:
//   //      from super() in a derived class
//   //      from the Singleton class
//
//   // if this constructor is being called from a derived class, then return the derived class instance using Singleton.getInstance(derivedClass, ...args);
//   // if this constructor is being called from the Singleton class, then call this.getInstance(derivedClass, ...args);
//   //
//   public constructor(private readonly derivedTypeArg?: Constructor, args?: any, options?: object){
//     // if no derivedType is passed, or the arg is not a constructor, then the class extends Singleton and is the derivedType
//
//
//    // Singleton.getInstance(derivedTypeArg, args);
//   }
//
//   public static getDerivedClass(arg, self){
//     console.log("arg: ", arg);
//     console.log("typeof arg: ", typeof arg);
//     console.log("this: ", this);
//     // If no arg is passed, or the arg is not a constructor, or the arg is the same as self, then the class extends Singleton and is the derivedType
//     if (!arg || arg.prototype === self || typeof arg !== "function" ) { //
//       console.log("getDerivedClass returning self: ", self);
//       return self as Constructor;
//     }
//
//
//     return arg;
//   };
//
//   public static getInstance<T extends Singleton<T>>(derivedTypeArg?, args?: any): Singleton<T> {
//     // If the derivedType is not passed, then the class extends Singleton and is the derivedType
//     // Looks for instance of derivedType in the instances map
//     // If it exists, then return it
//     // If it doesn't exist, then create it and return it
//     const derivedType = Singleton.getDerivedClass(derivedTypeArg, this);
//     // If the derivedType is passed, then the class is not extending Singleton and is not the derivedType
//     const typeName = derivedType.name;
//     if (!Singleton.instances.has(typeName)) {
//       console.log("Creating new Singleton instance: ", typeName);
//       // TODO: Causing an infinite loop. Figure out why.
//       const newInstance = args ? new derivedType(args): new derivedType();
//       console.log("newInstance: ", newInstance);
//       Singleton.instances.set(typeName, newInstance);
//     }
//     const foundInstance = Singleton.instances.get(typeName);
//     console.log("foundInstance: ", foundInstance);
//
//     if(!foundInstance){
//       throw new Error(`Error: ${typeName} could not be instantiated`);
//     }
//     return foundInstance;
//
//   }
//
//   public static getAllSingletons(): Singleton<any>[] {
//     return Array.from(Singleton.instances.values());
//   }
//
//   public static clearAllInstances(): void {
//     Singleton.instances.clear();
//   }
//
//   public static clearInstance<T extends Singleton<T>>(instance: Singleton<T>): void {
//     const typeName = instance.constructor.name;
//
//     if (Singleton.instances.has(typeName) && Singleton.instances.get(typeName) === instance) {
//       Singleton.instances.delete(typeName);
//     }
//   }
// }
//


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
