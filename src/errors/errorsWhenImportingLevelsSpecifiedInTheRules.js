const lengthPathToFile = require("../helpers/lengthPathToFile");
const absolutePathToFile = require("../helpers/absolutePathToFile");
const PathToCurrentFileWithOutContent = require("../helpers/pathToCurrentFileWithoutContent");
const setModuleByName = require("../helpers/setModuleByName");
const isTargetModuleLevelAboveCurrentModuleLevel = require("../helpers/comparisonOfIndexes");
const isTargetModuleLevelDeeperThanCurrentModuleLevel = require("../helpers/comparisonOfLength");
const setCurrentLevel = require("../helpers/setCurrentLevel");
const test = require("../preparingElementsForComparison");
module.exports = outputOfErrorsWhenImportingLevelsSpecifiedInTheRules;

function outputOfErrorsWhenImportingLevelsSpecifiedInTheRules(
  configurationTree,
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  jsConfigFileContent
) {
  let errorMessage = undefined;

  const asd = test(
    importDefinitionPath,
    configurationTree,
    pathToCurrentModule,
    rootDirectory,
    jsConfigFileContent
  );
  
  console.log(asd);

  if (asd.currentModuleLevel.name !== asd.targetModuleLevel.name &&
    asd.currentModuleLevel.index < asd.targetModuleLevel.index) {
    errorMessage = `Cannot import ${asd.currentModuleLevel.name} from ${asd.targetModuleLevel.name}`;
  } 
  return errorMessage;
}

function areNearestParentsEqual(targetModule, currentModule) {
  return targetModule.parents === currentModule.parents;
}

function areRootParentsEqual(targetModule, currentModule) {
  return targetModule.firstParent === currentModule.firstParent;
}

function absolutePathTo(pathToModule, importDefinitionPath) {
  return absolutePathToFile(
    PathToCurrentFileWithOutContent(pathToModule),
    importDefinitionPath
  );
}
