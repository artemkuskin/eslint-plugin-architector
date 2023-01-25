const fs = require("fs");
const path = require("path");
const TreeModel = require("tree-model");

module.exports = validateIfImportIsAllowed;

const architectureConfigTree = [];
let jsConfigFileContent = undefined;
function setJsConfigFile() {
  try {
    jsConfigFileContent = require(path.resolve("jsconfig.json"));
  } catch {
    jsConfigFileContent = null;
  }
}

/**
 *  This function is running by eslint every time.
 *
 * @param {String} pathToCurrentModule - module in which we write import definition
 * @param {String} importDefinitionPath
 * @param {Object} levelsConfiguration
 * @param {String} rootDirectory
 */

function validateIfImportIsAllowed(pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory) {
  const currentModuleIsInRootDirectory = Boolean(getParentFolder(rootDirectory, pathToCurrentModule));
  if (jsConfigFileContent === undefined) {
    setJsConfigFile();
  }

  const configurationTree = getArchitectureConfigurationTree(
    levelsConfiguration.file,
    levelsConfiguration,
    rootDirectory
  );

  const currentModuleLevel = setCurrentLevel(pathToCurrentModule) //pathToCurrentModule.split("/")[pathToCurrentModule.split("/").length - 2];
  const targetModuleLevel = checkTargetModuleLevel(configurationTree, importDefinitionPath);
  const currentModuleLevelConfiguration = setModuleByName(configurationTree, currentModuleLevel) //configurationTree.find((elem) => elem.name === currentModuleLevel);
  const importLevel = setCurrentLevel(importDefinitionPath) //importDefinitionPath.split("/")[importDefinitionPath.split("/").length - 2];
  const configurationOfTargetModule = setModuleByName(configurationTree, importLevel)//configurationTree.find((elem) => elem.name === importLevel);
  if (jsConfigFileContent) {
    const configurationTreeAlias = getLevelAlias(rootDirectory);
    const keyAlias = importDefinitionPath.split("/")[0];
    const targetAliasModule = configurationTreeAlias.find((elem) => elem.key === keyAlias); // сделать проверку на сущечтвование
    if (targetAliasModule) {
      return searchParentAliasesAndCompareThem(
        targetAliasModule,
        importDefinitionPath,
        pathToCurrentModule,
        rootDirectory,
        configurationTree
      );
    }
  }

  if (currentModuleIsInRootDirectory) {
    if (currentModuleLevel) {
      if (targetModuleLevel) {
        if (configurationOfTargetModule && currentModuleLevelConfiguration) {
          return searchForAFolderInTheRulesAndCompareThem(
            currentModuleLevelConfiguration,
            configurationOfTargetModule,
            importLevel,
            currentModuleLevel,
            configurationTree
          );
        } else {
          return searchForParentsIfNotSpecifiedInTheRules(
            pathToCurrentModule,
            importDefinitionPath,
            rootDirectory,
            configurationTree
          );
        }
      }
    }
  }
}

function setModuleByName (configurationTree, name) {
 return configurationTree.find((elem) => elem.name === name)
}

function setCurrentLevel (pathToModule) {
 return pathToModule.split("/")[pathToModule.split("/").length - 2]
}
/**
 *
 * @param {String} pathToCurrentModule
 * @param {String} importDefinitionPath
 * @param {String} rootDirectory
 * @param {Array} configurationTree
 * @returns
 */
function searchForParentsIfNotSpecifiedInTheRules(
  pathToCurrentModule,
  importDefinitionPath,
  rootDirectory,
  configurationTree
) {
  const pathToCurrentFile = pathToCurrentModule
    .split("/")
    .splice(0, pathToCurrentModule.split("/").length - 1)
    .join("/");

  const absolutePathToTheFile = path.resolve(pathToCurrentFile, importDefinitionPath);
  const firstParent = getParentFolder(rootDirectory, absolutePathToTheFile);
  const moduleTargetLevelFirstName = setModuleByName(configurationTree, firstParent[1])//configurationTree.find((elem) => elem.name === firstParent[1]); //что импортим
  const firstParentcCurrentLevel = getParentFolder(rootDirectory, pathToCurrentFile);
  const moduleCurrentLevelFirstName = setModuleByName(configurationTree, firstParentcCurrentLevel[1])//configurationTree.find((elem) => elem.name === firstParentcCurrentLevel[1]); //куда
  if (moduleTargetLevelFirstName.name !== moduleCurrentLevelFirstName.name) {
    if (moduleCurrentLevelFirstName.index < moduleTargetLevelFirstName.index) {
      return `Cannot import ${importLevel} from ${currentModuleLevel}`;
    }
  }
  if (moduleTargetLevelFirstName.name === moduleCurrentLevelFirstName.name) {
    const pathToCurrentFile = pathToCurrentModule
      .split("/")
      .splice(0, pathToCurrentModule.split("/").length - 1)
      .join("/");
    const absolutePathToTheFile = path.resolve(pathToCurrentFile, importDefinitionPath);
    if (pathToCurrentModule.split("/").length > absolutePathToTheFile.split("/").length) {
      return "qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww";
    }
  }
}

/**
 *
 * @param {Object} currentModuleLevelConfiguration
 * @param {Object} configurationOfTargetModule
 * @param {String} importLevel
 * @param {String} currentModuleLevel
 * @param {Array} configurationTree
 * @returns
 */
function searchForAFolderInTheRulesAndCompareThem(
  currentModuleLevelConfiguration,
  configurationOfTargetModule,
  importLevel,
  currentModuleLevel,
  configurationTree
) {
  if (currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents) {
    if (configurationOfTargetModule.index >= currentModuleLevelConfiguration.index) {
      return `Cannot import ${importLevel} from ${currentModuleLevel}`;
    }
  } else if (currentModuleLevelConfiguration.firstParent !== configurationOfTargetModule.firstParent) {
    const firstParentCurrentModuleLevelConfiguration = setModuleByName(configurationTree, currentModuleLevelConfiguration.firstParent) //configurationTree.find(
    //   (elem) => elem.name === currentModuleLevelConfiguration.firstParent
    // );
    const firstParentConfigurationOfTargetModule = setModuleByName(configurationTree, configurationOfTargetModule.firstParent)//configurationTree.find(
    //   (elem) => elem.name === configurationOfTargetModule.firstParent
    // );
    if (firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index) {
      return `${path.resolve("jsconfig.json")}`;
    }
  }
}

/**
 *
 * @param {Object} targetAliasModule
 * @param {String} importDefinitionPath
 * @param {String} pathToCurrentModule
 * @param {String} rootDirectory
 * @param {Array} configurationTree
 * @returns
 */
function searchParentAliasesAndCompareThem(
  targetAliasModule,
  importDefinitionPath,
  pathToCurrentModule,
  rootDirectory,
  configurationTree
) {
  const absolutePathtoTheFileAlias = path.resolve(
    targetAliasModule.path
      .split("/")
      .slice(0, targetAliasModule.path.split("/").length - 1)
      .join("/"),
    importDefinitionPath
  );
  const firstParentTargetLevelALias = getParentFolder(rootDirectory, absolutePathtoTheFileAlias); // что импортим
  const pathToCurrentFile = pathToCurrentModule
    .split("/")
    .splice(0, pathToCurrentModule.split("/").length - 1)
    .join("/");
  const firstParentCurrentLevel = getParentFolder(rootDirectory, pathToCurrentFile); // куда
  const moduleTargetLevelAliasFirstName = setModuleByName(configurationTree, firstParentTargetLevelALias[1])//configurationTree.find(
  //   (elem) => elem.name === firstParentTargetLevelALias[1]
  // );
  const moduleCurentLevelFirstName = setModuleByName(configurationTree,  firstParentCurrentLevel[1]) //configurationTree.find((elem) => elem.name === firstParentCurrentLevel[1]);
  if (moduleTargetLevelAliasFirstName.name !== moduleCurentLevelFirstName.name) {
    if (moduleTargetLevelAliasFirstName.index > moduleCurentLevelFirstName.index) {
      return "/////////////////////////////////////////";
    }
  }
}

/**
 *
 * @param {Array} architectureConfigRules
 * @param {Array} levelsConfiguration
 * @param {String} rootDirectory
 * @returns
 */
function getArchitectureConfigurationTree(architectureConfigRules, levelsConfiguration, rootDirectory) {
  for (let key in architectureConfigRules) {
    const lastParent = getAllParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level).lastParent;
    const firstParent = getAllParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level).firstParent;
    architectureConfigTree.push({
      name: architectureConfigRules[key].level,
      index: key,
      parents: lastParent || rootDirectory,
      firstParent: firstParent,
      children: architectureConfigRules[key].children,
    });
    if (architectureConfigRules[key].children.length !== 0) {
      getArchitectureConfigurationTree(architectureConfigRules[key].children, levelsConfiguration, rootDirectory);
    }
  }
  let resultarchitectureFree = architectureConfigTree.reduce(
    (acc, file) => {
      if (acc.map[file.name])
        // если данный город уже был
        return acc; // ничего не делаем, возвращаем уже собранное

      acc.map[file.name] = true; // помечаем город, как обработанный
      acc.resultarchitectureFree.push(file); // добавляем объект в массив городов
      return acc; // возвращаем собранное
    },
    {
      map: {}, // здесь будут отмечаться обработанные города
      resultarchitectureFree: [], // здесь конечный массив уникальных городов
    }
  ).resultarchitectureFree;
  return resultarchitectureFree;
}
/**
 *
 * @param {String} rootDirectory
 * @param {String} absolutePathToTheFile
 * @returns
 */
function getParentFolder(rootDirectory, absolutePathToTheFile) {
  let parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);
  return parent;
}

/**
 *
 * @param {String} rootDirectory
 * @returns
 */
function getLevelAlias(rootDirectory) {
  const parentsAlias = [];
  for (let key in jsConfigFileContent.compilerOptions.paths) {
    parentsAlias.push({ name: jsConfigFileContent.compilerOptions.paths[key].toString(), key: [key].toString() });
  }
  const configurationTreeAlias = [];
  for (let key in parentsAlias) {
    configurationTreeAlias.push({
      key: parentsAlias[key].key
        .split("/")
        .splice(0, parentsAlias[key].key.split("/").length - 1)
        .join("/"),
      path: path
        .resolve(
          parentsAlias[key].name.split("/").splice(0, parentsAlias[key].name.split("/").length).join("/"),
          rootDirectory
        )
        .split("/")
        .splice(
          0,
          path
            .resolve(
              parentsAlias[key].name
                .split("/")
                .splice(0, parentsAlias[key].name.split("/").length - 1)
                .join("/"),
              rootDirectory
            )
            .split("/").length - 1
        )
        .join("/"),
    });
  }
  return configurationTreeAlias;
}

/**
 *
 * @param {Array} configurationTree
 * @param {String} importDefinitionPath
 * @returns
 */
function checkTargetModuleLevel(configurationTree, importDefinitionPath) {
  const levelsNames = configurationTree.map((levelConfiguration) => levelConfiguration.name);

  const levelsNamesString = levelsNames.reduce((acc, cur) => {
    return `${acc}|${cur}`;
  });

  const targetModuleLevel = new RegExp(`(${levelsNamesString})`, "g").exec(importDefinitionPath);
  return targetModuleLevel;
}

/**
 *
 * @param {Array} dataset
 * @param {String} nodeLevel
 * @returns
 */
function getAllParentThisNode(dataset, nodeLevel) {
  let parents = [];
  tree = new TreeModel();
  dataset.forEach((element) => {
    let rootMain = tree.parse(element);
    rootMain.walk(function (node) {
      if (node.model.level === nodeLevel) {
        let x = node.getPath();
        x.forEach((element) => {
          parents.push(element.model.level);
        });
      }
    });
  });

  return { lastParent: parents[parents.length - 2], firstParent: parents[0] };
}
