import * as assert from 'assert';
import { makeMutableMap } from './map';

// TODO: write test cases for the methods of your map class
describe('MutableMap', function() {
    const map = makeMutableMap();
    //  divided up the test cases separately up to only use map class

    // Test that hasKey returns false when the key does not exist in the map
    it('hasKey - when a key does not exist', function() {
        assert.strictEqual(map.hasKey('testKey'), false);
    });

    // Test that setValue returns false when a new key-value pair gets added to the map
    it('setValue - when there is a new key', function() {
        assert.strictEqual(map.setValue('testKey', 'testValue'), false);
    });

    // Test that hasKey returns true when the key exists in the map
    it('hasKey - when a key exists', function() {
        assert.strictEqual(map.hasKey('testKey'), true);
    });

    // Test that getValue returns the correct value for a given key
    it('getValue - key ', function() {
        assert.strictEqual(map.getValue('testKey'), 'testValue');
    });

    // Test that setValue returns true when updating the value of an existing key
    it('setValue - when a key is existing', function() {
        assert.strictEqual(map.setValue('testKey', 'newValue'), true);
    });

    // Test that getValue returns the updated value after the value of a key has been changed
    it('getValue - when a key has new value', function() {
        assert.strictEqual(map.getValue('testKey'), 'newValue');
    });

    // Test that clear removes all key-value pairs from the map
    it('clear', function() {
        map.clear();
        assert.strictEqual(map.hasKey('testKey'), false);
    });
});