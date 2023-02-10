function getModuleByName(configurationTree, name) {
  return configurationTree.find((elem) => elem.name === name);
  
}

module.exports = getModuleByName;
