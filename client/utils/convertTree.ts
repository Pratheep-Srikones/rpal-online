export const changeTree = (tree: any, depth = 0) => {
  if (tree.head.type) {
    tree.head = tree.head.value;
  }
  //console.log(depth, tree.head);
  if (tree.child && tree.child.length > 0) {
    tree.child.forEach((child: any) => {
      changeTree(child, depth + 1);
    });
  }
  return tree;
};
