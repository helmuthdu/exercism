export class Zipper {
  static fromTree(tree) {
    const copy = branches =>
      branches
        ? Object.keys(branches)
            .filter(key => key !== 'value')
            .reduce(
              (t, branch) => {
                t[branch] = copy(t[branch]);
                return t;
              },
              { ...branches },
            )
        : null;

    return new Zipper(copy(tree));
  }

  constructor(tree) {
    this._tree = tree;
    this._path = [];
  }

  toTree() {
    return this._tree;
  }

  left() {
    this._path.push('left');
    return this._branch ? this : null;
  }

  right() {
    this._path.push('right');
    return this._branch ? this : null;
  }

  up() {
    if (this._path.length === 0) return null;

    this._path.pop();
    return this._branch ? this : null;
  }

  setValue(value) {
    this._branch.value = value;
    return this;
  }

  setLeft(leaf) {
    this._branch.left = leaf;
    return this;
  }

  setRight(leaf) {
    this._branch.right = leaf;
    return this;
  }

  value() {
    return this._branch.value;
  }

  get _branch() {
    return this._path.reduce((branch, leaf) => branch && branch[leaf], this._tree);
  }
}
