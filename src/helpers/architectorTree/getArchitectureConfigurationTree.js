const TreeModel = require("tree-model");

const architectureConfigTree = [];

module.exports = getArchitectureConfigurationTree;

function getArchitectureConfigurationTree({ levelsConfigurationFile, levelsConfiguration, rootDirectory }) {
  for (let key in levelsConfigurationFile) {
    const lastParent = getAllParentThisNode(levelsConfiguration.file, levelsConfigurationFile[key].level).lastParent;
    const firstParent = getAllParentThisNode(levelsConfiguration.file, levelsConfigurationFile[key].level).firstParent;
    architectureConfigTree.push({
      name: levelsConfigurationFile[key].level,
      index: key,
      parent: lastParent,
      firstParent: firstParent,
      children: levelsConfigurationFile[key].children,
    });
    if (levelsConfigurationFile[key].children.length !== 0) {
      getArchitectureConfigurationTree({
        levelsConfigurationFile: levelsConfigurationFile[key].children,
        levelsConfiguration,
        rootDirectory,
      });
    }
  }
  return resultArchitectureFree(architectureConfigTree);
}

function resultArchitectureFree(architectureConfigTree) {
  let resultArchitectureFree = architectureConfigTree.reduce(
    (acc, file) => {
      if (acc.map[file.name]) return acc;
      acc.map[file.name] = true;
      acc.resultarchitectureFree.push(file);
      return acc;
    },
    {
      map: {},
      resultarchitectureFree: [],
    }
  ).resultarchitectureFree;
  return resultArchitectureFree;
}

function getAllParentThisNode(dataset, nodeLevel) {
  let parents = [];
  let tree = new TreeModel();
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
