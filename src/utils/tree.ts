type TreeNode<T, ChildrenKey extends string> = T &
  Partial<Record<ChildrenKey, TreeNode<T, ChildrenKey>[]>>;

interface ArrayToTreeOptions<T extends Record<string, unknown>, ChildrenKey extends string> {
  idKey?: keyof T;
  parentKey?: keyof T;
  childrenKey?: ChildrenKey;
  rootParentValue?: unknown;
}

interface FilterLeafKeysOptions<T extends Record<string, unknown>, ChildrenKey extends string> {
  idKey?: keyof T;
  childrenKey?: ChildrenKey;
}

interface FilterFlatLeafKeysOptions<T extends Record<string, unknown>, ChildrenKey extends string>
  extends ArrayToTreeOptions<T, ChildrenKey>, FilterLeafKeysOptions<T, ChildrenKey> {}

// list: 一维数组数据源。
// options.idKey: 当前节点唯一标识字段，默认取 id。
// options.parentKey: 父节点标识字段，默认取 parentId。
// options.childrenKey: 子节点字段名，默认取 children。
// options.rootParentValue: 根节点的父级取值，默认是 null。
export const arrayToTree = <
  T extends Record<string, unknown>,
  ChildrenKey extends string = "children",
>(
  list: T[],
  options: ArrayToTreeOptions<T, ChildrenKey> = {},
): TreeNode<T, ChildrenKey>[] => {
  const {
    idKey = "id" as keyof T,
    parentKey = "parentId" as keyof T,
    childrenKey = "children" as ChildrenKey,
    rootParentValue = null,
  } = options;

  const nodeMap = new Map<unknown, TreeNode<T, ChildrenKey>>();
  const tree: TreeNode<T, ChildrenKey>[] = [];

  list.forEach((item) => {
    // 先按 id 建索引，后面组装父子关系时可以 O(1) 找到节点。
    nodeMap.set(item[idKey], { ...item } as TreeNode<T, ChildrenKey>);
  });

  nodeMap.forEach((node) => {
    const parentId = node[parentKey];

    // 父节点为空或找不到父节点时，统一视为根节点，兼容非完整扁平数据。
    if (parentId === rootParentValue || !nodeMap.has(parentId)) {
      tree.push(node);
      return;
    }

    const parentNode = nodeMap.get(parentId);
    if (!parentNode) {
      tree.push(node);
      return;
    }

    const children = (parentNode[childrenKey] as TreeNode<T, ChildrenKey>[] | undefined) || [];
    children.push(node);
    parentNode[childrenKey] = children as TreeNode<T, ChildrenKey>[ChildrenKey];
  });

  return tree;
};

// tree: 已经组装好的树结构。
// options.idKey: 当前节点唯一标识字段，默认取 id。
// options.childrenKey: 子节点字段名，默认取 children。
export const filterLeafKeys = <
  T extends Record<string, unknown>,
  ChildrenKey extends string = "children",
>(
  tree: TreeNode<T, ChildrenKey>[],
  options: FilterLeafKeysOptions<T, ChildrenKey> = {},
): unknown[] => {
  const { idKey = "id" as keyof T, childrenKey = "children" as ChildrenKey } = options;
  const leafKeys: unknown[] = [];

  const walk = (nodes: TreeNode<T, ChildrenKey>[]) => {
    nodes.forEach((node) => {
      const children = (node[childrenKey] as TreeNode<T, ChildrenKey>[] | undefined) || [];
      const nodeId = node[idKey];

      if (!children.length) {
        // el-tree 回显时只保留叶子节点 key，避免父子同时选中带来的勾选异常。
        leafKeys.push(nodeId);
        return;
      }

      walk(children);
    });
  };

  walk(tree);

  return leafKeys;
};

// list: 一维数组数据源。
// options.idKey: 当前节点唯一标识字段，默认取 id。
// options.parentKey: 父节点标识字段，默认取 parentId。
// options.childrenKey: 子节点字段名，默认取 children。
// options.rootParentValue: 根节点的父级取值，默认是 null。
export const filterFlatLeafKeys = <
  T extends Record<string, unknown>,
  ChildrenKey extends string = "children",
>(
  list: T[],
  options: FilterFlatLeafKeysOptions<T, ChildrenKey> = {},
): unknown[] => {
  // 扁平结构先转树，再复用叶子节点提取逻辑。
  const tree = arrayToTree(list, options);

  return filterLeafKeys(tree, options);
};
