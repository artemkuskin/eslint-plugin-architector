const absolutePathToFile = require("./absolutePathToFile");
const getParentFolder = require("./getParentFolder");
const PathToCurrentFileWithoutContent = require("./pathToCurrentFileWithoutContent");
const setModuleByName = require("./setModuleByName");
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
      moduleTargetLevelAliasFirstParent.name !== moduleCurentLevelFirstParent.name &&
      moduleTargetLevelAliasFirstParent.index > moduleCurentLevelFirstParent.index
    ) {
      errorMessage = "/////////////////////////////////////////";
    } else if (
      moduleTargetLevelAliasFirstParent.name === moduleCurentLevelFirstParent.name &&
      lengthPathToFile(pathToCurrentModule) > lengthPathToFile(absolutePathtoTheFileAlias)
    ) {
      errorMessage = "]]]]]]]]]]]]]]]]]]]]]]";
    }
  } else {
    if (
      moduleTargetLevelFirstParent.name !== moduleCurentLevelFirstParent.name &&
      moduleCurentLevelFirstParent.index < moduleTargetLevelFirstParent.index
    ) {
      errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
    } else if (
      moduleTargetLevelFirstParent.name === moduleCurentLevelFirstParent.name &&
      lengthPathToFile(pathToCurrentModule) > lengthPathToFile(absolutePathToTargetModule)
    ) {
      errorMessage = "qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";
    }
  }
  return errorMessage;
}

function lengthPathToFile(path) {
  return path.split("/").length;
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
