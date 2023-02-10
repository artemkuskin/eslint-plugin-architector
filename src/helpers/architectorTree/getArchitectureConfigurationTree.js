const TreeModel = require("tree-model");

const architectureConfigTree = [];

module.exports = getArchitectureConfigurationTree;

function getArchitectureConfigurationTree(architectureConfigRules, levelsConfiguration, rootDirectory) {
  const rootModuleLevel = {
    name: rootDirectory,
    index: 0,
    parent: "",
    architectorPath: rootDirectory,
  };

  for (let key in architectureConfigRules) {
    const firstParentLevel = getParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level).parent;
    const architectPath =
      rootDirectory +
      "/" +
      getParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level).archectorPath;
    architectureConfigTree.unshift(rootModuleLevel);
    architectureConfigTree.push({
      name: architectureConfigRules[key].level,
      index: key,
      parent: firstParentLevel || rootDirectory,
      children: architectureConfigRules[key].children,
      architectorPath: architectPath,
    });

    if (architectureConfigRules[key].children.length !== 0) {
      getArchitectureConfigurationTree(architectureConfigRules[key].children, levelsConfiguration, rootDirectory);
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

function getParentThisNode(dataset, nodeLevel) {
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

  return { parent: parents[parents.length - 2], archectorPath: parents.join("/") };
}
