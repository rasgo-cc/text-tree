import { TreeNode, TreeFlatNode, Config } from "./types";

export const createNode = (
  data: any,
  parent: TreeNode | null,
  config: Config
): TreeNode => {
  const { getId } = config;
  let treeNode: TreeNode = {
    data,
    id: getId(data),
    parentId: parent ? parent.id : null,
    children: []
  };
  if (parent) parent.children = [...parent.children, treeNode];
  return treeNode;
};

export const nodePath = (node: TreeNode, tree: TreeNode[]) => {
  const subTree: TreeNode[] = [];
  let parentNodeId = node.parentId;
  while (parentNodeId) {
    const parentNode = findNode(parentNodeId, tree);
    if (!parentNode) throw Error(`can't find parentNode of ${node.id}`);
    subTree.unshift(parentNode);
    parentNodeId = parentNode.parentId;
  }
  return subTree;
};

export const flattenNode = (
  node: TreeNode,
  tree: TreeNode[],
  config: Config
): TreeFlatNode => {
  const { children, parentId, ...flatNode } = node;
  delete node.data;
  const subTree = nodePath(node, tree);
  const ids =
    subTree.length > 0 ? [subTree[subTree.length - 1].id, node.id] : [node.id];
  const materializedId = ids.join(config.flatIdSeparator);
  node.id = materializedId;
  flatNode.id = materializedId;
  return flatNode;
};

export const forEachNode = (nodes: TreeNode[], fn: (node: TreeNode) => any) => {
  if (!nodes) return;
  for (const node of nodes) {
    fn(node);
    if (node.children) forEachNode(node.children, fn);
  }
};

export const findNode = (id: string, tree: TreeNode[]): TreeNode | null => {
  for (const node of tree) {
    if (node.id === id) return node as TreeNode;
    if (node.children) {
      const found = findNode(id, node.children);
      if (found) return found;
    }
  }
  return null;
};
