function setModuleByName(configurationTree, name) {
    return configurationTree.find((elem) => elem.name === name);
  }

  module.exports = setModuleByName