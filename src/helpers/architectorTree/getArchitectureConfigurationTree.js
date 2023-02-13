const TreeModel = require("tree-model");

module.exports = getArchitectureConfigurationTree;

const architectureConfigTree = [];

function getArchitectureConfigurationTree(architectureConfigRules, levelsConfiguration, rootDirectory) {
  for (let index in architectureConfigRules) {
    const rootModuleLevel = {
      name: rootDirectory,
      index: 0,
      parent: "",
      architectorPath: rootDirectory,
    };
    const architectorPath = rootDirectory + "/" + getParentAndarchitecturalPathThisNode(levelsConfiguration.file, architectureConfigRules[index].level).architectural;
    const levelName = architectureConfigRules[index].level;
    const childrenExist = Boolean(architectureConfigRules[index].children.length !== 0);

    architectureConfigTree.unshift(rootModuleLevel);
    architectureConfigTree.push({
      name: levelName,
      index: index,
      architectorPath: architectorPath,
    });
    
    if (childrenExist) {
      getArchitectureConfigurationTree(architectureConfigRules[index].children, levelsConfiguration, rootDirectory);
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

function getParentAndarchitecturalPathThisNode(dataset, nodeLevel) {
  let parents = [];
  let tree = new TreeModel();
  dataset.forEach((element) => {
    let rootMain = tree.parse(element);
    rootMain.walk(function (node) {
      if (node.model.level === nodeLevel) {
        let path = node.getPath();
        path.forEach((element) => {
          parents.push(element.model.level);
        });
      }
    });
  });

  return { parent: parents[parents.length - 2], architectural: parents.join("/") };
}
