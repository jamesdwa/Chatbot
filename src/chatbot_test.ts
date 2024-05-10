import * as assert from 'assert';
import { WordPattern } from './patterns';
import { chatResponse, applyPattern, matchPattern, assemble, getInLastUsedForTesting, clearLastUsedForTesting } from './chatbot';

describe('chatbot', function() {

  it('matchPattern', function() {
    const words1 = ['a', 'b', 'c', 'd'];
    assert.deepStrictEqual(
        matchPattern(words1, [['b', 'e']]), undefined);
    assert.deepStrictEqual(
        matchPattern(words1, [['b', 'c']]), [['a'], ['d']]);
    assert.deepStrictEqual(
        matchPattern(words1, [['a', 'b']]), [[], ['c', 'd']]);
    assert.deepStrictEqual(
        matchPattern(words1, [['c', 'd']]), [['a', 'b'], []]);

    const words2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    assert.deepStrictEqual(
        matchPattern(words2, [['b', 'c'], ['e', 'z']]), undefined);
    assert.deepStrictEqual(
        matchPattern(words2, [['b', 'c'], ['e', 'f']]), [['a'], ['d'], ['g']]);
    assert.deepStrictEqual(
        matchPattern(words2, [['b', 'c'], ['d', 'e']]), [['a'], [], ['f', 'g']]);
    assert.deepStrictEqual(
        matchPattern(words2, [['a', 'b'], ['f', 'g']]), [[], ['c', 'd', 'e'], []]);

    const words3 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    assert.deepStrictEqual(
        matchPattern(words3, [['b', 'c'], ['e', 'f'], ['h', 'z']]), undefined);
    assert.deepStrictEqual(
        matchPattern(words3, [['b', 'c'], ['e', 'f'], ['h', 'i']]),
        [['a'], ['d'], ['g'], ['j']]);
    assert.deepStrictEqual(
        matchPattern(words3, [['b', 'c'], ['e', 'f'], ['i', 'j']]),
        [['a'], ['d'], ['g', 'h'], []]);
    assert.deepStrictEqual(
        matchPattern(words3, [['b', 'c'], ['e', 'f'], ['g', 'h']]),
        [['a'], ['d'], [], ['i', 'j']]);

    clearLastUsedForTesting();
  });

  const PATTERNS: WordPattern[] = [
      { name: "foo",
        contains: [['foo']],
        responses: [
            ['why', 0, 'and', 'not', 1],
            [0, ',', 'is', 'that', 'so?'],
          ]},
      { name: "my",
        contains: [['my']],
        responses: [['talk', 'more', 'about', 'your', 1]]},
      { name: "bar",
        contains: [['bar']],
        responses: [['what', 'about', 1, '?']]}
    ];


  it('applyPattern', function() {    
    assert.deepStrictEqual(
        applyPattern(PATTERNS[0], [['arg0'], ['arg1']]),
        ['why', 'arg0', 'and', 'not', 'arg1']);
    assert.deepStrictEqual(getInLastUsedForTesting("foo"), "0");

    assert.deepStrictEqual(
        applyPattern(PATTERNS[0], [['arg0'], ['arg1']]),
        ['arg0', ',', 'is', 'that', 'so?']);
    assert.deepStrictEqual(getInLastUsedForTesting("foo"), "1");

    assert.deepStrictEqual(
        applyPattern(PATTERNS[0], [['A'], ['B']]),
        ['why', 'A', 'and', 'not', 'B']);
    assert.deepStrictEqual(getInLastUsedForTesting("foo"), "0");

    assert.deepStrictEqual(
        applyPattern(PATTERNS[2], [['arg0'], ['arg1']]),
        ['what', 'about', 'arg1', '?']);
    assert.deepStrictEqual(getInLastUsedForTesting("foo"), "0");
    assert.deepStrictEqual(getInLastUsedForTesting("bar"), "0");

    clearLastUsedForTesting();
  });

  it('chatResponse', function() {
    const memory: string[][] = [];
    assert.deepStrictEqual(
        chatResponse(['arg0', 'my', 'foo', 'arg1'], memory, PATTERNS),
        ['why', 'arg0', 'your', 'and', 'not', 'arg1']);
    assert.deepStrictEqual(getInLastUsedForTesting("foo"), "0");
    assert.deepStrictEqual(memory.length, 0);

    assert.deepStrictEqual(
        chatResponse(['arg2', 'my', 'bar', 'arg3'], memory, PATTERNS),
        ['what', 'about', 'arg3', '?']);
    assert.deepStrictEqual(getInLastUsedForTesting("bar"), "0");
    assert.deepStrictEqual(getInLastUsedForTesting("foo"), "0");
    assert.deepStrictEqual(getInLastUsedForTesting("my"), "0");
    assert.deepStrictEqual(memory.length, 1);

    assert.deepStrictEqual(
        chatResponse(['arg4', 'foo', 'arg5'], memory, PATTERNS),
        ['arg4', ',', 'is', 'that', 'so?']);
    assert.deepStrictEqual(getInLastUsedForTesting("bar"), "0");
    assert.deepStrictEqual(getInLastUsedForTesting("foo"), "1");
    assert.deepStrictEqual(getInLastUsedForTesting("my"), "0");
    assert.deepStrictEqual(memory.length, 1);

    assert.deepStrictEqual(
        chatResponse(['arg5', 'baz', 'arg6'], memory, PATTERNS),
        ['talk', 'more', 'about', 'your', 'bar', 'arg3']);
    assert.deepStrictEqual(getInLastUsedForTesting("bar"), "0");
    assert.deepStrictEqual(getInLastUsedForTesting("foo"), "1");
    assert.deepStrictEqual(getInLastUsedForTesting("my"), "0");
    assert.deepStrictEqual(memory.length, 0);

    assert.deepStrictEqual(
        chatResponse(['arg2', 'baz', 'arg3'], memory, PATTERNS),
        ["I'm", "not", "sure", "I", "understand", "you", "fully", "."]);
    assert.deepStrictEqual(getInLastUsedForTesting(".none"), "0");
    assert.deepStrictEqual(getInLastUsedForTesting("bar"), "0");
    assert.deepStrictEqual(getInLastUsedForTesting("foo"), "1");
    assert.deepStrictEqual(getInLastUsedForTesting("my"), "0");
    assert.deepStrictEqual(memory.length, 0);

    clearLastUsedForTesting();
  });

  it('assemble', function() {
    assert.deepStrictEqual(assemble([], [['a'], ['b']]), []);
    assert.deepStrictEqual(assemble(['foo'], [['a'], ['b']]), ['foo']);
    assert.deepStrictEqual(assemble([0], [['a'], ['b', 'c']]), ['a']);
    assert.deepStrictEqual(assemble([1], [['a'], ['b', 'c']]), ['b', 'c']);
    assert.deepStrictEqual(
        assemble(['d', 0], [['a'], ['b', 'c']]), ['d', 'a']);
    assert.deepStrictEqual(
        assemble(['d', 1], [['a'], ['b', 'c']]), ['d', 'b', 'c']);
    assert.deepStrictEqual(
        assemble(['d', 0, 'e'], [['a'], ['b', 'c']]), ['d', 'a', 'e']);
    assert.deepStrictEqual(
        assemble(['d', 1, 'e'], [['a'], ['b', 'c']]), ['d', 'b', 'c', 'e']);
    assert.deepStrictEqual(
        assemble(
            ['the', 'quick', 1, 2, 'jumped', 'over', 'the', 'lazy', 0],
            [['dog'], ['brown'], ['fox']]),
        ['the', 'quick', 'brown', 'fox', 'jumped', 'over', 'the', 'lazy', 'dog']);
  });

});