const path = require("path");
const getAliasesList = require("../../architectorTree/configurationListAleases");
const getPathToCurrentFileWithoutExtension = require("../../convertPath/pathToCurrentFileWithoutContent");
const getArchitectureConfigurationTree = require("../../architectorTree/getArchitectureConfiguration");
const getDataAboutCurrentLevelAndTargetLevel = require("../currentAndTargetLevels/getCurrentAndTargetLevel");
const getAbsolutePath = require("./absolutePath");
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

  const absolutePathToTargetLevel = getAbsolutePathToTargetLevel({
    pathToCurrentModule,
    importDefinitionPath,
    rootDirectory,
  });

  return getDataAboutCurrentLevelAndTargetLevel({
    pathToCurrentModule,
    configurationTree,
    absolutePathToTargetLevel,
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

function getAbsolutePathToTargetLevel({ pathToCurrentModule, importDefinitionPath, rootDirectory }) {
  let absolutePathToTargetModuleFolder;

  const targetModuleAlias = getLevelAlias(
    getAliasesList(rootDirectory, jsConfigAliases),
    getAliaseKey(importDefinitionPath)
  );
  const absolutePathToTargetModule = getAbsolutePath(pathToCurrentModule, importDefinitionPath);
  if (targetModuleAlias) {
    absolutePathToTargetModuleFolder = targetModuleAlias.path;
  } else {
    absolutePathToTargetModuleFolder = getPathToCurrentFileWithoutExtension(
      getAbsolutePath(pathToCurrentModule, importDefinitionPath)
    );
  }

  return {
    absolutePathToTargetModuleFolder: absolutePathToTargetModuleFolder,
    absolutePathToTargetModule: absolutePathToTargetModule,
  };
}

function getLevelAlias(configurationTree, aliasKey) {
  if (configurationTree) {
    return configurationTree.find((elem) => elem.key === aliasKey);
  }
}

function getAliaseKey(importDefinitionPath) {
  return importDefinitionPath.split("/")[0];
}
