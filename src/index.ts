import readline from "readline";
import fs from "fs-extra";
import { PassThrough, Readable } from "stream";

import { renameObjKeys } from "./utils";

export type TreeNodeId = string | number | null;

interface TreeNode {
  id: TreeNodeId;
  parentId: TreeNodeId;
  children: TreeNode[];
  data: any;
}

interface TreeFlatNode {
  id: TreeNodeId;
  data: any;
}

export interface Config {
  keys: Partial<{
    id: string;
    parentId: string;
    children: string;
    data: string;
  }>;
  tab: Partial<{
    insertSpaces: boolean;
    size: number;
    autoDetect: boolean;
  }>;
  flatten: boolean;
  getId: (data: any) => TreeNodeId;
}

export interface FlattenTreeData {
  tree: TreeNode[];
  nodes: TreeFlatNode[];
}

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
  getId: (data: any) => data
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

const createNode = (
  data: any,
  parent: TreeNode | null = null,
  config: Partial<Config> = {}
): TreeNode => {
  const { getId, keys } = getConfig(config);
  let treeNode: TreeNode = {
    data,
    id: getId(data),
    parentId: parent ? parent.id : null,
    children: []
  };
  if (parent) parent.children = [...parent.children, treeNode];
  return treeNode;
};

const nodeFlatten = (node: TreeNode): TreeFlatNode => {
  const { children, parentId, ...flatNode } = node;
  delete node.data;
  return flatNode;
};

const forEachNode = (nodes: TreeNode[], fn: (node: TreeNode) => any) => {
  if (!nodes) return;
  for (const node of nodes) {
    fn(node);
    if (node.children) forEachNode(node.children, fn);
  }
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
        const flatNode = nodeFlatten(treeNode);
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
