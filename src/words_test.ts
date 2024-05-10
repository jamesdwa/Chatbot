import * as assert from 'assert';
import { substitute, replaceWords, splitWords, wordsContain, toString } from './words';
import { AssocList } from './assoc';
import { explode_array } from './list';


describe('words', function() {

  it('substitute', function() {
    const map: AssocList<string> = explode_array([["a", "b"], ["c", "d"]]);
    const words: string[] = ["a"];

    // Example test:
    // Notice how we mutate 'words' here rather than returning a result,
    // then the mutated value is the actual to be compared to expected result
    substitute(words, map);
    assert.deepStrictEqual(words, ["b"]);

    
    // Feel free to add tests here, but you won't have to turn them in
  });

  it('replaceWords', function() {
    const repl: AssocList<string[]> = explode_array([["a", ["a", "b", "c"]], ["d", ["e", "f"]]]);
    assert.deepStrictEqual(replaceWords([], repl), []);
    assert.deepStrictEqual(replaceWords(["the"], repl), ["the"]);
    assert.deepStrictEqual(replaceWords(["a"], repl), ["a", "b", "c"]);
    assert.deepStrictEqual(replaceWords(["the", "a", "dog"], repl),
        ["the", "a", "b", "c", "dog"]);
    assert.deepStrictEqual(replaceWords(["the", "a", "dog", "d"], repl),
        ["the", "a", "b", "c", "dog", "e", "f"]);
  });

  it('splitWords', function() {
    assert.deepStrictEqual(splitWords(""), []);
    assert.deepStrictEqual(splitWords(" "), []);
    assert.deepStrictEqual(splitWords("."), ["."]);
    assert.deepStrictEqual(splitWords("a"), ["a"]);
    assert.deepStrictEqual(splitWords("abc"), ["abc"]);
    assert.deepStrictEqual(splitWords("ab,"), ["ab", ","]);
    assert.deepStrictEqual(splitWords("ab,c"), ["ab", ",", "c"]);
    assert.deepStrictEqual(splitWords("ab ,c"), ["ab", ",", "c"]);
    assert.deepStrictEqual(splitWords("ab, c"), ["ab", ",", "c"]);
    assert.deepStrictEqual(splitWords("ab , c"), ["ab", ",", "c"]);
    assert.deepStrictEqual(splitWords("a b , c"), ["a", "b", ",", "c"]);
    assert.deepStrictEqual(splitWords("abc, def! gh"), ["abc", ",", "def", "!", "gh"]);
    assert.deepStrictEqual(splitWords("abc def  gh"), ["abc", "def", "gh"]);
  });

  it('wordsContain', function() {
    assert.deepStrictEqual(wordsContain([], ["a"]), -1);
    assert.deepStrictEqual(wordsContain(["a", "b"], ["a"]), 0);
    assert.deepStrictEqual(wordsContain(["c", "a", "b"], ["a"]), 1);
    assert.deepStrictEqual(wordsContain(["c", "a", "c", "d"], ["d"]), 3);
    assert.deepStrictEqual(wordsContain(["c", "a", "d", "c", "e"], ["a"]), 1);
    assert.deepStrictEqual(wordsContain(["c", "a", "d", "c", "e"], ["f"]), -1);

    assert.deepStrictEqual(wordsContain([], ["a", "b"]), -1);
    assert.deepStrictEqual(wordsContain(["a", "b"], ["a", "b"]), 0);
    assert.deepStrictEqual(wordsContain(["c", "a", "b"], ["a", "b"]), 1);
    assert.deepStrictEqual(wordsContain(["c", "a", "c", "d"], ["a", "c"]), 1);
    assert.deepStrictEqual(wordsContain(["c", "a", "d", "c", "e"], ["a", "c"]), -1);

    assert.deepStrictEqual(wordsContain(["a", "b", "c", "d", "e"], ["a", "b", "c"]), 0);
    assert.deepStrictEqual(wordsContain(["a", "b", "c", "d", "e"], ["a", "b", "d"]), -1);
    assert.deepStrictEqual(wordsContain(["a", "b", "c", "d", "e"], ["b", "c", "d"]), 1);
    assert.deepStrictEqual(wordsContain(["a", "b", "c", "d", "e"], ["b", "c", "a"]), -1);
    assert.deepStrictEqual(wordsContain(["a", "b", "c", "d", "e"], ["c", "d", "e"]), 2);
    assert.deepStrictEqual(wordsContain(["a", "b", "c", "d", "e"], ["c", "d", "c"]), -1);

    assert.deepStrictEqual(wordsContain(["A", "B", "C", "D", "E"], ["c", "d", "e"]), 2);
    assert.deepStrictEqual(wordsContain(["A", "B", "C", "D", "E"], ["c", "d", "c"]), -1);
  });

  it('toString', function() {
    assert.deepStrictEqual(toString([]), "");
    assert.deepStrictEqual(toString(["a"]), "a");
    assert.deepStrictEqual(toString([","]), ",");
    assert.deepStrictEqual(toString(["a", "!"]), "a!");
    assert.deepStrictEqual(toString(["a", "b"]), "a b");
    assert.deepStrictEqual(toString(["abc", "def"]), "abc def");
    assert.deepStrictEqual(toString(["a", ",", "b"]), "a, b");
    assert.deepStrictEqual(toString(["a", ",", "b", "c", "!"]), "a, b c!");
    assert.deepStrictEqual(toString(["a", ",", "b", "c", "!", "d"]), "a, b c! d");
    assert.deepStrictEqual(toString(["what", "?", "!", "?"]), "what?!?");
  });

});
