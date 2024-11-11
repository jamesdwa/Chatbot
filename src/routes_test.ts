import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { chat, save, load, resetTranscriptsForTesting } from './routes';


describe('routes', function() {

  it('chat', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {}});
    const res1 = httpMocks.createResponse();
    chat(req1, res1);
  
    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "message" was missing');

    // Second branch, straight line code
    const req2 = httpMocks.createRequest({method: 'GET', url: '/',
        query: {message: "I hate computers."}});
    const res2 = httpMocks.createResponse();
    chat(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
        {response: "Do computers worry you?"});

    const req3 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {message: "Are you alive"}});
    const res3 = httpMocks.createResponse();
    chat(req3, res3);

    assert.deepStrictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(),
        {response: "Why are you interested in whether I am alive or not?"});

  });

  it('save', function() {
    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: 1086, value: "some stuff"}});
    const res = httpMocks.createResponse();
    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "name" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {value: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "value" was missing');

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "L"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        'required argument "value" was missing');

    // Third branch, straight line code

    const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "some stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {replaced: false});

    const req5 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "different stuff"}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);

    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {replaced: true});

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetTranscriptsForTesting();
  });

  it('load', function() {
    // TODO (5c): write tests for load
    //  - note that you will need to make requests to 'save' in order for there
    //    to be transcripts for load to retrieve (see example below)
    // - You should write tests using our usual branching heuristics (including
    //   all error case branches)

    // Test for load function when name is not provided
    let loadReq = httpMocks.createRequest({method: 'GET', url: '/load'});
    let loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    assert.deepStrictEqual(loadRes._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes._getData(), 'required query parameter "name" was missing');
    resetTranscriptsForTesting();

    // Test for load function when name does not exist
    loadReq = httpMocks.createRequest({method: 'GET', url: '/load', query: {name: "non-existing"}});
    loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    assert.deepStrictEqual(loadRes._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes._getData(), 'no transcript found with name "non-existing"');
    resetTranscriptsForTesting();

    // Example test:
    // First need to save something in order to load it
    const saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "key", value: "transcript value"}});
    const saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);
    // Now we can actually (mock a) request to load the transcript
    loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "key"}});
    loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    // Validate that both the status code and the output is as expected
    assert.deepStrictEqual(loadRes._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes._getData(), {value: "transcript value"});


    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetTranscriptsForTesting();
  });

});
