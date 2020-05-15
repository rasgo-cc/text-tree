import readline from "readline";
import fs from "fs-extra";
import { PassThrough, Readable } from "stream";
import { Config, FlattenTreeData, TreeNode } from "./types";
import { createNode, flattenNode, forEachNode } from "./tree";
import { renameObjKeys } from "./utils";

const defaultConfig: Config = {
  keys: {
    id: "id",
    parentId: "parentId",
    children: "children",
    data: "data"
  },
  tab: {
    insertSpaces: false,
    size: 4,
    autoDetect: true
  },
  flatten: false,
  flatIdSeparator: "|",
  getId: (data: any) => data,
  transformId: (id: string) => id
};

const getConfig = (config: Partial<Config> = {}): Required<Config> => {
  return { ...defaultConfig, ...config };
};

const getRegExp = (config: Config) => {
  const {
    tab: { insertSpaces, size }
  } = config;
  return insertSpaces ? new RegExp(` {${size}}`, "g") : new RegExp("\t", "g");
};

export const parseStream = async (
  stream: fs.ReadStream | Readable,
  config: Partial<Config> = {}
): Promise<TreeNode[] | FlattenTreeData> => {
  const original = stream.pipe(new PassThrough());
  const _config = getConfig(config);

  if (_config.tab.autoDetect) {
    const clone = stream.pipe(new PassThrough());
    const rl = readline.createInterface({ input: clone });

    for await (const line of rl) {
      if (line.search(" ") >= 0) {
        _config.tab.insertSpaces = true;
        _config.tab.size = line.search(/\S/);
        break;
      }
      if (line.search("\t") >= 0) {
        _config.tab.insertSpaces = false;
        break;
      }
    }
  }

  const rl = readline.createInterface({ input: original });
  const re = getRegExp(_config);
  const { flatten = false } = _config;
  const flatNodes: any[] = [];

  return new Promise((resolve, _reject) => {
    let roots: any[] = [];
    let parents: { [depth: number]: any } = {};

    rl.on("line", line => {
      const match = line.match(re);
      const depth = !match ? 0 : match.length;
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      let parent = depth === 0 ? null : parents[depth - 1];
      let treeNode = createNode(trimmedLine, parent, _config);
      if (flatten) {
        const flatNode = flattenNode(treeNode, roots, _config);
        flatNodes.push(flatNode);
      }

      if (depth === 0) {
        roots.push(treeNode);
      }
      parents[depth] = treeNode;
    });

    rl.on("close", () => {
      const { keys } = _config;
      forEachNode([...roots, ...flatNodes], node =>
        renameObjKeys(node, keys as any)
      );
      return resolve(
        flatten ? ({ tree: roots, nodes: flatNodes } as FlattenTreeData) : roots
      );
    });
  });
};

export const parseFile = (filePath: string, config: Partial<Config> = {}) => {
  return parseStream(fs.createReadStream(filePath), config);
};

export const parseString = (str: string, config: Partial<Config> = {}) => {
  return parseStream(Readable.from(str), config);
};
