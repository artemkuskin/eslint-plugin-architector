const lengthPathToFile = require("../helpers/lengthPathToFile");
const absolutePathToFile = require("../helpers/absolutePathToFile");
const getParentFolder = require("../helpers/getParentFolder");
const PathToCurrentFileWithoutContent = require("../helpers/pathToCurrentFileWithoutContent");
const setModuleByName = require("../helpers/setModuleByName");
const comparisonOfIndexes = require("../helpers/comparisonOfIndexes");
module.exports = errorWhenImportingLevelsNotIncludedInRules;

function errorWhenImportingLevelsNotIncludedInRules(
  configurationTree,
  rootDirectory,
  pathToCurrentModule,
  importDefinitionPath,
  importLevel,
  currentModuleLevel,
  targetAliasModule
) {
  const moduleCurentLevelFirstParent = setLevelsCurent(configurationTree, rootDirectory, pathToCurrentModule);
  const absolutePathToTargetModule = absolutePathTo(pathToCurrentModule, importDefinitionPath);
  const moduleTargetLevelFirstParent = setLevelsTarget(configurationTree, absolutePathToTargetModule, rootDirectory);
  let errorMessage = undefined;

  if (targetAliasModule) {
    const absolutePathtoTheFileAlias = absolutePathTo(targetAliasModule.path, importDefinitionPath);
    const moduleTargetLevelAliasFirstParent = setLevelsTarget(
      configurationTree,
      absolutePathtoTheFileAlias,
      rootDirectory
    );
    if (
      unequalNames(moduleTargetLevelAliasFirstParent, moduleCurentLevelFirstParent) &&
      comparisonOfIndexes(moduleTargetLevelAliasFirstParent, moduleCurentLevelFirstParent)
    ) {
      errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
    } else if (
      equalityOfNames(moduleTargetLevelAliasFirstParent, moduleCurentLevelFirstParent) &&
      comparisonOfLength(pathToCurrentModule, absolutePathtoTheFileAlias)
    ) {
      errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
    }
  } else {
    if (
      unequalNames(moduleTargetLevelFirstParent, moduleCurentLevelFirstParent) &&
      comparisonOfIndexes(moduleTargetLevelFirstParent, moduleCurentLevelFirstParent)
    ) {
      errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
    } else if (
      equalityOfNames(moduleTargetLevelFirstParent, moduleCurentLevelFirstParent) &&
      comparisonOfLength(pathToCurrentModule, absolutePathToTargetModule)
    ) {
      errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
    }
  }
  return errorMessage;
}

function unequalNames(targetModule, currentModule) {
  return targetModule.name !== currentModule.name;
}

function equalityOfNames(targetModule, currentModule) {
  return targetModule.name === currentModule.name;
}

function comparisonOfLength(currentModule, targetModule) {
  return lengthPathToFile(currentModule) > lengthPathToFile(targetModule);
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithoutContent(pathToModule), importDefinitionPath);
}

function setLevelsTarget(configurationTree, absolutePathToTargetLevel, rootDirectory) {
  return setModuleByName(configurationTree, getParentFolder(rootDirectory, absolutePathToTargetLevel));
}

function setLevelsCurent(configurationTree, rootDirectory, pathToCurrentModule) {
  return setModuleByName(
    configurationTree,
    getParentFolder(rootDirectory, PathToCurrentFileWithoutContent(pathToCurrentModule))
  );
}
