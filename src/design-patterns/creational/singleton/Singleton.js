/*
// Description: Singleton class

  TODO: Check if this walkthrough is accurate
  Instantiate a derived class with new keyword
   In the Constructor of BaseClass after DerivedClass calls super(), the new.target is the DerivedClass
  Constructor tasks in order:
  1. Hande default and initial options merging
  2. Determine the derived class from either a passed in reference (subClass) or the calling class using new.target and the 'this' value.
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
  static instances = new WeakMap();
  static instance = null;

  constructor(subClass = null, args = null, initialOptions = {}) {
    // Our constructor is responsible for determining what the derived class is from either a passed in reference or the calling class.
    // This reference is then passed to the getInstance method to get or create the instance of the derived class
    // We will also pass in the args and options to the getInstance method

    const defaultOptions = {
      madeWithNewKeyword: false
    };
/*  Merge given initial options with default options */
    const singletonOptions = {...defaultOptions, ...initialOptions};

/* Assign ref the given subclass. If the subClass is not passed, then if new.target is valid ref = this. This will be further validated in getInstance  */
    const isNewTargetValid = new.target === this.constructor && new.target !== Singleton;
    const isSubClassValid = subClass && !Array.isArray(subClass) && subClass !== Singleton;
    isNewTargetValid && (singletonOptions.madeWithNewKeyword = true);
    const ref = isSubClassValid ? subClass: (isNewTargetValid && this);

/* Get instance and return it  */
    const instance = Singleton.getInstance(ref, args || [], singletonOptions);
    if(!instance){
      console.error("No instance was returned from getInstance");
    }
    return instance
  }


  /* The function that creates, gets, and sets instances */
  static getInstance(refArg, refOptions, singletonOptions = {}) {
    if(!refArg && this === Singleton){
      throw new Error("refArg is required when calling getInstance from the Singleton class");
    }
    const ref = refArg || this;
    const {refInstance = null, refConstructor = null} =  Singleton.#getConstructorAndInstance(ref, Singleton);

    if (!refConstructor) {
      throw new Error("refType could not be derived");
    }

    // If there is an instance of the derived class already, and it's not a placeholder, return it.
    const isExistingInstance = refInstance && (refConstructor.instance !== "placeholder");
    if (isExistingInstance) {
      return refConstructor.instance;
    }

    // If there is an instance of the derived class already, and it's either a placeholder or created with the 'new' keyword, then this instance is already in the process of being created.  In this case, return the instance.
    const instanceInProcess = refInstance && (singletonOptions.madeWithNewKeyword || refConstructor.instance === "placeholder");
    if(instanceInProcess){
      if(!refInstance || refInstance === "placeholder"){
        const newInstance = Singleton.#setInstance(refConstructor, new);
        return newInstance;
      }
      return refInstance;
    }
/* If there is a refConstructor but not a refInstance then create new instance. Must set "placeholder" or circular instance can be created */
    const shouldCreateNewDerivedClassInstance  = !!refConstructor && !refInstance;
    if(shouldCreateNewDerivedClassInstance){
      refConstructor.instance = "placeholder";
      const instance = new refConstructor(refOptions);
      if (instance){
        return instance
       //return Singleton.#setInstance(refConstructor, refInstance);
      }
    }

    const newInstance = new refConstructor(refOptions);

    Singleton.#setInstance(refConstructor, newInstance);


    //Singleton.instances.set(refConstructor.instance, refConstructor.instance); not implemented yet
    return refConstructor.instance;
  }

  static getAllInstances(){
    const instances = this.instances && Array.from(this.instances);
    console.log("getAllInstances| instances: ", instances);
    return instances;
  }
  static #setInstance = (refConstructor, instance) => {
    Singleton.instances.set(refConstructor, instance);
    refConstructor.instance = instance;
    return refConstructor.instance
  };
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
   static #getConstructorAndInstance = (variable, optionalClass = null) => {
     if(!variable){
       return;
     }
     const isInstanceOfAClass = Singleton.#isVariableInstanceOfAClass(variable);
     if(isInstanceOfAClass){
       return {refInstance: variable, refConstructor: variable.constructor};
     }
     return {refInstance: variable.instance , refConstructor: variable};
   }

 }

module.exports = {Singleton};
