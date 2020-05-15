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
  flatIdSeparator: string;
  getId: (data: any) => string;
  transformId: (id: string) => string;
}

export interface FlattenTreeData {
  tree: TreeNode[];
  nodes: TreeFlatNode[];
}

export interface TreeNode {
  id: string;
  parentId: string | null;
  children: TreeNode[];
  data: any;
}

export interface TreeFlatNode {
  id: string;
  data: any;
}
