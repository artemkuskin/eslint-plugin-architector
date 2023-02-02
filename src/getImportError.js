// const returnOfAllPossibleErrors = require("./rules/returnOfAllPossibleErrors");
// const getArchitectureConfigurationTree = require("./helpers/getArchitectureConfigurationTree");
// const absolutePathToFile = require("./helpers/absolutePathToFile");
// const setModuleByName = require("./helpers/setModuleByName");
// module.exports = getImportError;

// function getImportError(
//   rootDirectory,
//   importDefinitionPath,
//   pathToCurrentModule,
//   levelsConfiguration,
//   jsConfigFileContent
// ) {
//   const configurationTree = getArchitectureConfigurationTree(
//     levelsConfiguration.file,
//     levelsConfiguration,
//     rootDirectory
//   );

//   return returnOfAllPossibleErrors(
//     pathToCurrentModule,
//     importDefinitionPath,
//     rootDirectory,
//     jsConfigFileContent,
//     levelsConfiguration,
//   );
// }

// function firstElemImportDefinitionPath(importDefinitionPath) {
//   return importDefinitionPath.split("/")[0];
// }

// function setLevelByKey(configurationTree, key) {
//   return configurationTree.find((elem) => elem.key === key);
// }

// function absolutePathTo(pathToModule, importDefinitionPath) {
//   return absolutePathToFile(PathToCurrentFileWithoutContent(pathToModule), importDefinitionPath);
// }
// function setLevelsTarget(configurationTree, absolutePathToTargetLevel, rootDirectory) {
//   return setModuleByName(configurationTree, getParentFolder(rootDirectory, absolutePathToTargetLevel));
// }

// function setLevelsCurent(configurationTree, rootDirectory, pathToCurrentModule) {
//   return setModuleByName(
//     configurationTree,
//     getParentFolder(rootDirectory, PathToCurrentFileWithoutContent(pathToCurrentModule))
//   );
// }