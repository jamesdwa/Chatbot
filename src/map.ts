// TODO: create your new mutable map interface, class that implements it with an
//       association list, and factory function to initialize a new blank map
import { cons, nil } from "./list";
import { AssocList, contains_key, get_value } from "./assoc";

export interface MutableMap<V> {
    /**
     * Checks if there is some value associated with a given key in the map.
     * @param key The key to check.
     * @returns True if the key exists in the map, false otherwise.
     */
    hasKey: (key: string) => boolean;
  
    /**
     * Gets the value associated with a given key in the map.
     * @param key The key to get the value for.
     * @throws Error if there is no such key.
     * @returns The value associated with the key.
     */
    getValue: (key: string) => V | undefined;

    /**
     * Sets a value for a given key in the map, replacing the current value if a pair with the given key already exists.
     * @param key The key to set the value for.
     * @param value The value to set.
     * @returns True if a value was replaced, false otherwise.
     */
    setValue: (key: string, value: V) => boolean;

    /**
     * Clears all pairs from the map.
     */
    clear: () => void;
}

class AssocListMap<V> implements MutableMap<V> {
    // AF: obj = this.MutableMap;
    private MutableMap: AssocList<V> = nil;

    /**
     * Returns a list of all color names that include the given text.
     * @param text Text to look for in the names of the colors (case insensitive).
     * @returns List of all color names that include the given text.
     */
    hasKey = (key: string): boolean => {
        return contains_key(key, this.MutableMap);
    }

    /**
     * Gets the value associated with a given key in the map.
     * @param key The key to get the value for.
     * @throws Error if there is no such key.
     * @returns The value associated with the key.
     */
    getValue = (key: string): V | undefined => {
        if (!this.hasKey(key)) {
            return undefined;
        }
        return get_value(key, this.MutableMap);
    }

    /**
     * Sets a value for a given key in the map, replacing the current value if a pair with the given key already exists.
     * @param key The key to set the value for.
     * @param value The value to set.
     * @returns True if a value was replaced, false otherwise.
     */
    setValue = (key: string, value: V): boolean => {
        const replaced = this.hasKey(key);
        this.MutableMap = cons([key, value], this.MutableMap);
        return replaced;
    }

    /**
     * Clears all pairs from the map.
     */
    clear = (): void => {
        this.MutableMap = nil;
    }
}

/**
 * Factory function to create a new mutable map.
 * @returns A new instance of AssocListMap.
 */
export const makeMutableMap = <V>(): MutableMap<V> => {
    return new AssocListMap<V>();
}