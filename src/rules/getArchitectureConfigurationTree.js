const getAllParentThisNode = require("./getAllParentThisNode");

const architectureConfigTree = [];
function getArchitectureConfigurationTree(architectureConfigRules, levelsConfiguration, rootDirectory) {
    for (let key in architectureConfigRules) {
      const lastParent = getAllParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level).lastParent;
      const firstParent = getAllParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level).firstParent;
      architectureConfigTree.push({
        name: architectureConfigRules[key].level,
        index: key,
        parents: lastParent || rootDirectory,
        firstParent: firstParent,
        children: architectureConfigRules[key].children,
      });
      if (architectureConfigRules[key].children.length !== 0) {
        getArchitectureConfigurationTree(architectureConfigRules[key].children, levelsConfiguration, rootDirectory);
      }
    }
    let resultarchitectureFree = architectureConfigTree.reduce(
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
    return resultarchitectureFree;
  }

  module.exports = getArchitectureConfigurationTree