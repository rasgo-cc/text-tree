import "mocha";
import assert from "assert";

import { parseFile, parseString } from "../src/index";
import * as expected from "./data/expected";
import testStr from "./data/str";

describe("tree-text", () => {
  it("should parse tabbed text into tree", async () => {
    const result = await parseFile("./test/data/tabs.txt");
    assert.deepStrictEqual(result, expected.resultDefaultKeys);
  });

  it("should parse 4spaces text into tree", async () => {
    const result = await parseFile("./test/data/4spaces.txt");
    assert.deepStrictEqual(result, expected.resultDefaultKeys);
  });

  it("should parse 3spaces text into tree", async () => {
    const result = await parseFile("./test/data/3spaces.txt");
    assert.deepStrictEqual(result, expected.resultDefaultKeys);
  });

  it("should fail to parse bad text", async () => {
    const result = await parseFile("./test/data/bad.txt");
    assert.notDeepStrictEqual(result, expected.resultDefaultKeys);
  });

  it("should parse from string", async () => {
    const result = await parseString(testStr);
    assert.deepStrictEqual(result, expected.resultDefaultKeys);
  });

  it("should parse into flatten structure", async () => {
    const result = await parseString(testStr, { flatten: true });
    assert.deepStrictEqual(result, expected.resultFlat);
  });
});
