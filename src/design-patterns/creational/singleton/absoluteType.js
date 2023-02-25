// Here is something ive been working on with GPT-3. I have used a few prompts to get chat-gpt3 to generate something as comprehensive as possible.
// I will try to get chat GPT-3 to refine further and further.
// I will also have it write tests for the function.

function absoluteType(variable) {
  const type = typeof variable;

  if (type === "object") {
    if (variable === null) {
      return "null";
    }

    if (variable[Symbol.toStringTag]) {
      return variable[Symbol.toStringTag];
    }

    if (variable[Symbol.iterator] && typeof variable[Symbol.iterator] === "function") {
      return "iterator";
    }

    if (variable.constructor) {
      const constructorName = variable.constructor.name;

      if (constructorName === "Promise") {
        return "promise";
      }

      if (/^AsyncFunction/.test(constructorName)) {
        return "asyncfunction";
      }

      if (/^Proxy/.test(constructorName)) {
        return "proxy";
      }

      if (/^TypedArray/.test(constructorName)) {
        return "typedarray";
      }

      if (/^RegExp/.test(constructorName) || variable instanceof RegExp) {
        return "regexp";
      }

      if (/^Map/.test(constructorName) || variable instanceof Map) {
        return "map";
      }

      if (/^Set/.test(constructorName) || variable instanceof Set) {
        return "set";
      }

      if (/^WeakMap/.test(constructorName) || variable instanceof WeakMap) {
        return "weakmap";
      }

      if (/^WeakSet/.test(constructorName) || variable instanceof WeakSet) {
        return "weakset";
      }

      if (variable instanceof Date) {
        return "date";
      }
    }
  }

  return type;
}
