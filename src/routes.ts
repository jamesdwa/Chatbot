import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { splitWords, toString } from './words';
import { PATTERNS } from "./patterns";
import { chatResponse } from "./chatbot";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Keep track of possible responses for when we run out of things to say.
const memory: string[][] = [];

// TODO: create a new mutable map constant to store transcripts by 
//       calling the correct factory


/**
 * Handles request for /chat, with a message included as a query parameter,
 * by getting the next chat response.
 */
export const chat = (req: SafeRequest, res: SafeResponse): void => {
  const msg = first(req.query.message);
  if (msg === undefined) {
    res.status(400).send('required argument "message" was missing');
    return;
  }

  const words = splitWords(msg);
  const result = chatResponse(words, memory, PATTERNS);
  res.send({response: toString(result)});
}

/** Handles request for /save by storing the given transcript. */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }

  // TODO(5a): implement this part 
  //  - store the passed in value in the map under the given name
  //  - return a record indicating whether that replaced an existing transcript

  res.send({replaced: false});  // TODO(5a): replace 
}

/** Handles request for /load by returning the transcript requested. */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  // TODO(5b): implement this function
  //  - chat() & save() functions may be useful examples for error checking!
}

/** 
 * Used in tests to set the transcripts map back to empty. 
 * (exported ONLY for testing)
 */
export const resetTranscriptsForTesting = (): void => {
  // TODO(): implement this function
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param) && param.length > 0) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
}
