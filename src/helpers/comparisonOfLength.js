const lengthPathToFile = require("./lengthPathToFile");

function isTargetModuleLevelDeeperThanCurrentModuleLevel(currentModule, targetModule) {
  return lengthPathToFile(currentModule) > lengthPathToFile(targetModule);
}

module.exports = isTargetModuleLevelDeeperThanCurrentModuleLevel