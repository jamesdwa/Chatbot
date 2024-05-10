import { List } from "./list";


/** An assocation list is a list of key-value pairs, where keys are strings. */
export type AssocList<V> = List<[string, V]>;


/**
 * Determines if the given key is within a pair in the given list
 * @param x key to determine if list contains
 * @param L list to determine if key is contained in
 * @returns contains-key(x, L)
 */
export const contains_key = <V> (x: string, L: AssocList<V>): boolean => {
  if (L.kind === "nil") {
    return false;
  } else {
    const [y, _v]: [string, V] = L.hd;
    if (x === y) {
      return true;
    } else {
      return contains_key(x, L.tl);
    }
  }
};


/**
 * Gets the value paired with the first instance of the given key 
 * in the given list
 * @param x key to find the corresponding value for
 * @param L list to find x's value pair in
 * @returns get-value(x, L)
 * @throws Error when !contains-key(x, L)
 */
export const get_value = <V> (x: string, L: AssocList<V>): V => {
  if (L.kind === "nil") {
    throw new Error("key is not contained in Map");
  } else  {
    const [y, v]: [string, V] = L.hd;
    if (x === y) {
      return v;
    } else {
      return get_value(x, L.tl);
    }
  }
};
