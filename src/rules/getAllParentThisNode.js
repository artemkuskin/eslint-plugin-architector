const TreeModel = require("tree-model")

function getAllParentThisNode(dataset, nodeLevel) {
    let parents = [];
    tree = new TreeModel();
    dataset.forEach((element) => {
      let rootMain = tree.parse(element);
      rootMain.walk(function (node) {
        if (node.model.level === nodeLevel) {
          let x = node.getPath();
          x.forEach((element) => {
            parents.push(element.model.level);
          });
        }
      });
    });
  
    return { lastParent: parents[parents.length - 2], firstParent: parents[0] };
  }

  module.exports = getAllParentThisNode