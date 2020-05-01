import "mocha";
import assert from "assert";

import { parseFile } from "../src/index";
import * as expected from "./data/expected";

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
});
