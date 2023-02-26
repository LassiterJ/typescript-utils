/*
// Description: Singleton class

  TODO: Check if this walkthrough is accurate
  Instantiate a derived class with new keyword
   In the Constructor of BaseClass after DerivedClass calls super(), the new.target is the DerivedClass
  Constructor tasks in order:
  1. Hande default and initial options merging
  2. Determine the derived class from either a passed in reference (derivedClass) or the calling class using new.target and the 'this' value.
  3. set options that need to be passed to the getInstance method
  4. Call the getInstance method to get or create the instance of the derived class
  GetInstance tasks in order:
  1. Identify the type of the derived class and get value of the derived class constructor
  2. Validate the derived class type
  3. Handle checking for an existing instance of the derived class
  If an instance of the derived class exists, return it;
  If an instance of the derived class does not exist, create one and return it Unless its a special case;
  Special Case: if the derived class instance is "placeholder" then this instance is already in the process of being created. In this case, return the "this" value(derived class instance) that was passed in to the getInstance method.
  4. Create a new instance of the derived class if one does not exist using the method required by the derived class type
  5. Set the instance of the derived class in the static DerivedClass.instance property.
  6. Set the instance of the derived class in the static DerivedClass.instances WeakMap. // For future use with classes that do not extend BaseClass

 */
  // TODO: Enhancements
    // Add Option for changing implementation method.
        // Methods:
          // Altering the prototype of a passed class that is not already a derived class.
          // Create a new class that extends the features of the  Singleton class as well as those of the passed class. The new class has with the prototype of the passed class.
//  Local Utility Functions
// TODO: When refactoring decide to move to separate utility file or make static methods of the BaseClass

const extendClass = (baseClass, derivedClass) => { // TODO: For future implementation of implementationMethod
  const extendedClass = function(...args) {
    Reflect.construct(baseClass, args, this);
    Reflect.construct(derivedClass, args, this);
  };
  Object.setPrototypeOf(extendedClass.prototype, derivedClass.prototype);
  Object.setPrototypeOf(extendedClass, derivedClass);
  return extendedClass;
}

// Main Class
class Singleton {
  static #finalizerRegistry = new FinalizationRegistry(key => {
    const instance = Singleton.instances.get(key);
    if (instance) {
      Singleton.clearInstance(instance);
    }
  });
//   static #setInstance = (refConstructor, instance) => {
//      const weakInstance = new WeakRef(instance);
//    // const weakInstance = instance;
//     Singleton.instances.set(refConstructor, weakInstance);
//     refConstructor.instance = weakInstance;
//     Singleton.#finalizerRegistry.register(weakInstance, refConstructor);
//
//     return instance;
// };
  static #isVariableInstanceOfAClass = (ref) => {
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

  static instances = new Map();
  static instanceRef = null;
  static get instance() {
    const ref = this.instanceRef;
    return ref && ref.deref() || Singleton.instanceRef;
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

  static isCreatingInstance = false;
  static getInstance(classRef, classArgs, singletonOptions = {}) {
    if(!classRef && this === Singleton){ // specifically checking for the Singleton class and not a derived class
      throw new Error("refArg is required when calling getInstance from the Singleton class");
    }
    const ref = classRef || this;

    const isInstanceOfAClass = Singleton.#isVariableInstanceOfAClass(ref);
    const isNewInstance = isInstanceOfAClass && (ref !== ref?.constructor?.instance);

    const newInstance = isNewInstance ? ref : null;
    const refConstructor = isInstanceOfAClass ? ref.constructor : ref;
    const existingInstance = isInstanceOfAClass ? ref.constructor?.instance: ref.instance;
    const instanceInProcess = singletonOptions.madeWithNewKeyword || !!refConstructor?.isCreatingInstance;

    if (!refConstructor) {
      throw new Error("refType could not be derived");
    }
    /* If there is an instance of the derived class found, and we're not in the process of setting the instance already then go ahead and return the found instance*/
    if (existingInstance && !instanceInProcess){
      return existingInstance;
    }
    /* If there is an instance of the derived class already, and it's either a placeholder or has been created with the 'new' keyword, then this instance is already in the process of being created.  In this case, set the refConstructor to the instance and  return the instance.*/
    if(instanceInProcess){
      return !existingInstance ? refConstructor.instance = newInstance: existingInstance; // no need to set instance if the process has already started
      // return !existingInstance ? Singleton.#setInstance(refConstructor, newInstance): existingInstance; // no need to set instance if the process has already started
    }

    const shouldCreateInstance  = !newInstance && !existingInstance;
    if(shouldCreateInstance){
      refConstructor.isCreatingInstance = true;
      const instance = new refConstructor(classArgs);
      if (instance){
        refConstructor.isCreatingInstance = false;
        // return Singleton.#setInstance(refConstructor, instance);
        return refConstructor.instance = instance;
      }
    }
    /* Else set the instance and return it */
    if(!newInstance){
      throw new Error("Could not get instance Please check to see if you are passing in a valid class reference or are using a class from the Singleton inheritance chain.");
    }
    // return Singleton.#setInstance(refConstructor, newInstance);
    return refConstructor.instance = newInstance;
  }
  static getAllInstances(){
    const instances = Singleton.instances && Array.from(Singleton.instances);
    console.log("getAllInstances| instances: ", instances);
    return instances;
  }
  static clearAllInstances(){
    // This won't remove instances that have been directly set on the static instance property of the target class;
    Singleton.instances = new WeakMap();
    Singleton.instance = null; // Singleton.instance should never be se but just in case.
  }
  static clearInstance = (ref) => {
    if(!ref){
      return;
    }
    const isInstanceOfAClass = Singleton.#isVariableInstanceOfAClass(ref) && !ref.instance; // TODO: this might not work if the ref is a class that extends Singleton
    const refConstructor = isInstanceOfAClass ? ref: ref.constructor;
    if(!refConstructor){
      return;
    }
    refConstructor.instance = null;
    Singleton.instances.delete(refConstructor);
  };

  constructor(classRef = null, classArgs = null, initialOptions = {}) {
    /*
        Our constructor is responsible for determining what the derived class is from either a passed in reference or the calling class.
       This reference is then passed to the getInstance method to get or create the instance of the derived class
       We will also pass in the args and options to the getInstance method
    */

    const defaultOptions = {
      madeWithNewKeyword: false
    };
/*  Merge given initial options with default options */
    const singletonOptions = {...defaultOptions, ...initialOptions};

/* Assign ref the given derivedClass. If the derivedClass is not passed, then if new.target is valid ref = this. This will be further validated in getInstance  */
    const isNewTargetValid = new.target === this.constructor && new.target !== Singleton;
    const isDerivedClassValid = classRef && !Array.isArray(classRef) && classRef !== Singleton;
    isNewTargetValid && (singletonOptions.madeWithNewKeyword = true);
    const ref = isDerivedClassValid ? classRef: (isNewTargetValid && this);

/* Get instance and return it  */
    const instance = Singleton.getInstance(ref, classArgs || [], singletonOptions);
    if(!instance){
      console.error("No instance was returned from getInstance");
    }
    return instance
  }
  /* The main function of our class that creates, gets, and sets instances */

 }

module.exports = {Singleton};
