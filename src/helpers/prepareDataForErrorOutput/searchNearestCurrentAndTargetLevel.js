const path = require("path");
const getLevelAlias = require("../architectorTree/configurationTreeAleases");
const getPathToCurrentFileWithoutExtension = require("../convertPath/pathToCurrentFileWithoutContent");
const getArchitectureConfigurationTree = require("../architectorTree/getArchitectureConfigurationTree");
const getAllTheDataAboutTheCurrentLevel = require("./getCurrentAndTargetLevel");
const getAbsolutePathTo = require("./absolutePathTo");
module.exports = dataForErrorDetection;

let jsConfigFileContent = undefined;

function dataForErrorDetection({
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  levelsConfigurationFile,
  levelsConfiguration,
}) {
  if (jsConfigFileContent === undefined) {
    setJsConfigFile();
  }

  const targetModuleAlias = setLevelByKey(
    getLevelAlias(rootDirectory, jsConfigFileContent),
    keyAliases(importDefinitionPath)
  );
  const configurationTree = getArchitectureConfigurationTree(
    levelsConfigurationFile,
    levelsConfiguration,
    rootDirectory
  );

  const absolutePathToTargetModule = getAbsolutePathToTargetModule({
    pathToCurrentModule,
    importDefinitionPath,
    targetModuleAlias,
  });

  return getAllTheDataAboutTheCurrentLevel({
    pathToCurrentModule,
    importDefinitionPath,
    configurationTree,
    absolutePathToTargetModule,
    rootDirectory
  });
}

function setJsConfigFile() {
  try {
    jsConfigFileContent = require(path.resolve("jsconfig.json"));
  } catch {
    jsConfigFileContent = null;
  }
}

function getAbsolutePathToTargetModule({ pathToCurrentModule, importDefinitionPath, targetModuleAlias }) {
  let absolutePathToTargetModule;

  if (Boolean(targetModuleAlias)) {
    absolutePathToTargetModule = targetModuleAlias.path;
  } else {
    absolutePathToTargetModule = getPathToCurrentFileWithoutExtension(
      getAbsolutePathTo(pathToCurrentModule, importDefinitionPath)
    );
  }
  return absolutePathToTargetModule;
}

function setLevelByKey(configurationTree, key) {
  return configurationTree.find((elem) => elem.key === key);
}

function keyAliases(importDefinitionPath) {
  return importDefinitionPath.split("/")[0];
}
