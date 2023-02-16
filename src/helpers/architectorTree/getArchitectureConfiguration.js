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
    const levelName = architectureConfigRules[index].level;
    const architecturalPath =
      rootDirectory + "/" + getParentAndArchitecturalPathThisNode(levelsConfiguration.file, levelName).architectural;
    const childrenExist = Boolean(getQuantityChildren(architectureConfigRules[index]) !== 0);

    architectureConfigTree.unshift(rootModuleLevel);
    architectureConfigTree.push({
      name: levelName,
      index: index,
      architectorPath: architecturalPath,
      independentChildren: architectureConfigRules[index].independentChildren || false,
    });
    if (childrenExist) {
      getArchitectureConfigurationTree(architectureConfigRules[index].children, levelsConfiguration, rootDirectory);
    }
  }
  return getResultArchitectureFree(architectureConfigTree);
}

function getResultArchitectureFree(architectureConfigTree) {
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

function getParentAndArchitecturalPathThisNode(dataset, nodeLevel) {
  const parents = [];
  const tree = new TreeModel();

  dataset.forEach((element) => {
    const rootMain = tree.parse(element);
    rootMain.walk(function (node) {
      if (node.model.level === nodeLevel) {
        const path = node.getPath();
        path.forEach((element) => {
          parents.push(element.model.level);
        });
      }
    });
  });

  return { parent: parents[parents.length - 2], architectural: parents.join("/") };
}

function getQuantityChildren(architectureConfigRules) {
  return architectureConfigRules.children.length;
}
