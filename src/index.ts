export const extendClass = ({superClass, derivedClass,thisArg, passedArgs, ...restArgs}) => { // TODO: For future implementation of implementationMethod
  const extendedClass = () => {
    Reflect.construct(superClass, passedArgs, this);
    Reflect.construct(derivedClass, passedArgs, this);
  };
  Object.setPrototypeOf(extendedClass.prototype, derivedClass.prototype);
  Object.setPrototypeOf(extendedClass, derivedClass);
  return extendedClass;
}

// TODO: more examples
