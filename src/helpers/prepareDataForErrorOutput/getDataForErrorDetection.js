const path = require("path");
const getAliasesList = require("../architectorTree/configurationTreeAleases");
const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
const getArchitectureConfigurationTree = require("../architectorTree/getArchitectureConfigurationTree");
const getDataAboutCurrentLevelAndTargetLevel = require("./getCurrentAndTargetLevel");
const getAbsolutePathTo = require("./absolutePathTo");
module.exports = getDataForErrorDetection;

let jsConfigAliases = undefined;

function getDataForErrorDetection({
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  levelsConfigurationFile,
  levelsConfiguration,
}) {
  if (jsConfigAliases === undefined) {
    setJsConfigAliases();
  }

  const configurationTree = getArchitectureConfigurationTree(
    levelsConfigurationFile,
    levelsConfiguration,
    rootDirectory
  );

  const absolutePathToTargetModuleFolder = getAbsolutePathToTargetModuleFolder({
    pathToCurrentModule,
    importDefinitionPath,
    rootDirectory,
  });

  return getDataAboutCurrentLevelAndTargetLevel({
    pathToCurrentModule,
    importDefinitionPath,
    configurationTree,
    absolutePathToTargetModuleFolder,
    rootDirectory,
  });
}

/**
 * jsconfig can contain aliases
 */
function setJsConfigAliases() {
  try {
    const jsconfig = require(path.resolve("jsconfig.json"));

    if (jsconfig.compilerOptions.paths) {
      jsConfigAliases = jsconfig.compilerOptions.paths;
    }
  } catch {
    jsConfigAliases = null;
  }
}

function getAbsolutePathToTargetModuleFolder({ pathToCurrentModule, importDefinitionPath, rootDirectory }) {
  let absolutePathToTargetModuleFolder;

  const targetModuleAlias = getLevelAlias(
    getAliasesList(rootDirectory, jsConfigAliases),
    getAliaseKey(importDefinitionPath)
  );

  if (targetModuleAlias) {
    absolutePathToTargetModuleFolder = targetModuleAlias.path;
  } else {
    absolutePathToTargetModuleFolder = getPathToCurrentFileWithoutExtension(
      getAbsolutePathTo(pathToCurrentModule, importDefinitionPath)
    );
  }
  return absolutePathToTargetModuleFolder;
}

function getLevelAlias(configurationTree, aliasKey) {
  if (configurationTree) {
    return configurationTree.find((elem) => elem.key === aliasKey);
  }
}

function getAliaseKey(importDefinitionPath) {
  return importDefinitionPath.split("/")[0];
}
