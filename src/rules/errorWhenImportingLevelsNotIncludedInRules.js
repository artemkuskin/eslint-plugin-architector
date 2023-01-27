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
  const moduleCurentLevelFirstParent = setLevelsCurent (configurationTree, rootDirectory, pathToCurrentModule)

  if (targetAliasModule) {
    const absolutePathtoTheFileAlias = absolutePathTo(targetAliasModule.path, importDefinitionPath);
    const moduleTargetLevelAliasFirstParent = setLevelsTarget (configurationTree, absolutePathtoTheFileAlias, rootDirectory)

    if (moduleTargetLevelAliasFirstParent.name !== moduleCurentLevelFirstParent.name) {
      if (moduleTargetLevelAliasFirstParent.index > moduleCurentLevelFirstParent.index) {
        return "/////////////////////////////////////////";
      }
    }
  } else {
    const absolutePathToTargetModule = absolutePathTo(pathToCurrentModule, importDefinitionPath);
    const moduleTargetLevelFirstParent = setLevelsTarget (configurationTree, absolutePathToTargetModule, rootDirectory)
    if (
      moduleTargetLevelFirstParent.name !== moduleCurentLevelFirstParent.name &&
      moduleCurentLevelFirstParent.index < moduleTargetLevelFirstParent.index
    ) {
      return `Cannot import ${importLevel} from ${currentModuleLevel}`;
    }
    if (
      moduleTargetLevelFirstParent.name === moduleCurentLevelFirstParent.name &&
      lengthPathToFile(pathToCurrentModule) > lengthPathToFile(absolutePathToTargetModule)
    ) {
      return "qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";
    }
  }
}

function lengthPathToFile(path) {
  return path.split("/").length;
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithoutContent(pathToModule), importDefinitionPath);
}

function setLevelsTarget (configurationTree, absolutePathToTargetLevel, rootDirectory) {
  return setModuleByName(
    configurationTree,
    getParentFolder(rootDirectory, absolutePathToTargetLevel)
  );
}

function setLevelsCurent (configurationTree, rootDirectory, pathToCurrentModule) {
  return setModuleByName(
    configurationTree,
    getParentFolder(rootDirectory, PathToCurrentFileWithoutContent(pathToCurrentModule))
  );
}