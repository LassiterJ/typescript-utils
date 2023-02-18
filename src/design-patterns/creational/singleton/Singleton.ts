export class Singleton<T extends Singleton<T>> {
  private static instances: Set<Singleton<any>> = new Set();

  protected constructor() {
    const derivedType = this.constructor as new () => T;
    const typeName = derivedType.name;

    if (Singleton.instances.has(this)) {
      throw new Error(`Error: ${typeName} has already been instantiated`);
    }

    Singleton.instances.add(this);
  }

  public static getInstance(): Singleton<any> {
    const derivedType = this as new () => T;

    for (const instance of Singleton.instances) {
      if (instance.constructor === derivedType) {
        return instance;
      }
    }

    const newInstance = new derivedType();
    Singleton.instances.add(newInstance);
    return newInstance;
  }

  public static getAllSingletons(): Singleton<any>[] { // May use a generic version of this in an abstract class to supply design patterns with common methods
    return Array.from(Singleton.instances.values());
  }
}
