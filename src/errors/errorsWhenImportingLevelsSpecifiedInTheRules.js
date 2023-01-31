const lengthPathToFile = require("../helpers/lengthPathToFile");
const absolutePathToFile = require("../helpers/absolutePathToFile");
const PathToCurrentFileWithOutContent = require("../helpers/pathToCurrentFileWithoutContent");
const setModuleByName = require("../helpers/setModuleByName");
const isTargetModuleLevelAboveCurrentModuleLevel = require("../helpers/comparisonOfIndexes");
const isTargetModuleLevelDeeperThanCurrentModuleLevel = require("../helpers/comparisonOfLength");
const getTargetAndPath = require("../preparingElementsForComparison");
module.exports = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules;

function outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
  currentModuleLevelConfiguration,
  configurationOfTargetModule,
  importLevel,
  currentModuleLevel,
  configurationTree,
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
      jsConfigFileContent
) {
  let errorMessage = undefined;
  
  // const firstParentCurrentModuleLevelConfiguration = setModuleByName(
  //   configurationTree,
  //   currentModuleLevelConfiguration.firstParent
  // );
  // const firstParentConfigurationOfTargetModule = setModuleByName(
  //   configurationTree,
  //   configurationOfTargetModule.firstParent
  // );
  // const absolutePathToTargetModule = absolutePathTo(pathToCurrentModule, importDefinitionPath);
  const firstParentCurrentModuleLevelConfiguration = getTargetAndPath (pathToCurrentModule,importDefinitionPath, configurationTree,rootDirectory,jsConfigFileContent).currentLevel
  const firstParentConfigurationOfTargetModule = getTargetAndPath (pathToCurrentModule,importDefinitionPath, configurationTree,rootDirectory,jsConfigFileContent).moduleTargetLevel
  const absolutePathToTargetModule = getTargetAndPath (pathToCurrentModule,importDefinitionPath, configurationTree,rootDirectory,jsConfigFileContent).absolutePath


  const currentAndTargetModulesAreChildrenOfTheSameNearestLevel = areNearestParentsEqual(configurationOfTargetModule, currentModuleLevelConfiguration);
  const currentAndTargetModulesAreChildrenOfTheSameRootLevel =  areRootParentsEqual(configurationOfTargetModule, currentModuleLevelConfiguration)

  if (
    currentAndTargetModulesAreChildrenOfTheSameNearestLevel &&
    isTargetModuleLevelAboveCurrentModuleLevel(configurationOfTargetModule, currentModuleLevelConfiguration)
  ) {
    errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  } else if (
    currentAndTargetModulesAreChildrenOfTheSameRootLevel &&
    isTargetModuleLevelDeeperThanCurrentModuleLevel(pathToCurrentModule, absolutePathToTargetModule)
  ) {
    errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  } else if (
    ! currentAndTargetModulesAreChildrenOfTheSameRootLevel &&
    isTargetModuleLevelAboveCurrentModuleLevel(firstParentConfigurationOfTargetModule, firstParentCurrentModuleLevelConfiguration)
  ) {
    errorMessage = `Cannot import ${importLevel} from ${currentModuleLevel}`;
  }

  return errorMessage;
}

function areNearestParentsEqual (targetModule, currentModule) {
  return targetModule.parents === currentModule.parents
}

function areRootParentsEqual (targetModule, currentModule) {
  return targetModule.firstParent === currentModule.firstParent
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(PathToCurrentFileWithOutContent(pathToModule), importDefinitionPath);
}

