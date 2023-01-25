const fs = require("fs");
const path = require("path");
const TreeModel = require("tree-model");

module.exports = validateIfImportIsAllowed;

let jsConfigFileContent = require(path.resolve("jsconfig.json"));

/**
 *  This function is running by eslint every time.
 *
 * @param {*} pathToCurrentModule - module in which we write import definition
 * @param {*} importDefinitionPath
 * @param {*} levelsConfiguration
 * @param {*} rootDirectory
 */

function validateIfImportIsAllowed(pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory) {
  if (jsConfigFileContent) {
    const configurationTreeAlias = getLevelAlias(rootDirectory);

    const configurationTree = getArchitectureConfigurationTree(
      levelsConfiguration.file,
      levelsConfiguration,
      rootDirectory
    );
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

  const currentModuleIsInRootDirectory = Boolean(getParentFolder(rootDirectory, pathToCurrentModule));

  if (currentModuleIsInRootDirectory) {
    const partsOfPathToCurrentModule = pathToCurrentModule.split("/");
    const currentModuleLevel = partsOfPathToCurrentModule[partsOfPathToCurrentModule.length - 2];
    if (currentModuleLevel) {
      const configurationTree = getArchitectureConfigurationTree(
        levelsConfiguration.file,
        levelsConfiguration,
        rootDirectory
      );
      const targetModuleLevel = checkTargetModuleLevel(configurationTree, importDefinitionPath);
      if (targetModuleLevel) {
        const currentModuleLevelConfiguration = configurationTree.find((elem) => elem.name === currentModuleLevel);
        const partsOfPathToTargetModule = importDefinitionPath.split("/");
        const importLevel = partsOfPathToTargetModule[partsOfPathToTargetModule.length - 2];
        const configurationOfTargetModule = configurationTree.find((elem) => elem.name === importLevel);
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
  const moduleTargetLevelFirstName = configurationTree.find((elem) => elem.name === firstParent[1]); //что импортим
  const firstParentcCurrentLevel = getParentFolder(rootDirectory, pathToCurrentFile);
  const moduleCurrentLevelFirstName = configurationTree.find((elem) => elem.name === firstParentcCurrentLevel[1]); //куда
  if (moduleTargetLevelFirstName.name !== moduleCurrentLevelFirstName.name) {
    if (moduleCurrentLevelFirstName.index < moduleTargetLevelFirstName.index) {
      return `adasdasdasdasd`;
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
    const firstParentCurrentModuleLevelConfiguration = configurationTree.find(
      (elem) => elem.name === currentModuleLevelConfiguration.firstParent
    );
    const firstParentConfigurationOfTargetModule = configurationTree.find(
      (elem) => elem.name === configurationOfTargetModule.firstParent
    );
    if (firstParentConfigurationOfTargetModule.index >= firstParentCurrentModuleLevelConfiguration.index) {
      return `${path.resolve("jsconfig.json")}`;
    }
  }
}

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
  const moduleTargetLevelAliasFirstName = configurationTree.find(
    (elem) => elem.name === firstParentTargetLevelALias[1]
  );
  const moduleCurentLevelFirstName = configurationTree.find((elem) => elem.name === firstParentCurrentLevel[1]);
  console.log(moduleTargetLevelAliasFirstName, moduleCurentLevelFirstName); //mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
  console.log(targetAliasModule);
  if (moduleTargetLevelAliasFirstName.name !== moduleCurentLevelFirstName.name) {
    if (moduleTargetLevelAliasFirstName.index > moduleCurentLevelFirstName.index) {
      return "/////////////////////////////////////////";
    }
  }
}
const architectureConfigTree = [];
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

function getParentFolder(rootDirectory, absolutePathToTheFile) {
  let parent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile);
  return parent;
}

function getLevelAlias(rootDirectory) {
  const parentsAlias = [];
  console.log(jsConfigFileContent);
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

function checkTargetModuleLevel(configurationTree, importDefinitionPath) {
  const levelsNames = configurationTree.map((levelConfiguration) => levelConfiguration.name);

  const levelsNamesString = levelsNames.reduce((acc, cur) => {
    return `${acc}|${cur}`;
  });

  const targetModuleLevel = new RegExp(`(${levelsNamesString})`, "g").exec(importDefinitionPath);
  return targetModuleLevel;
}

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

// const fs = require('fs');
// const path = require('path');

// function flatten(lists) {
//   return lists.reduce((a, b) => a.concat(b), []);
// }

// function getDirectories(srcpath) {
//   return fs.readdirSync(srcpath)
//     .map(file => path.join(srcpath, file))
//     .filter(path => fs.statSync(path).isDirectory());
// }

// function getDirectoriesRecursive(srcpath) {
//   return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
// }

// const foldersName =  getDirectoriesRecursive(path.resolve(__dirname, "MyFolder"))
// const arr = []
// const formStructur = () => {
//     for (let key in foldersName) {
//  const targetFolder = foldersName[key].split('/')
//  console.log(targetFolder);
//     arr.push({level: targetFolder[targetFolder.length-1], index:key, parents: targetFolder[targetFolder.length-2]} )
// // console.log(targetFolder[targetFolder.length - 1]);
// }
// return arr
// }
// console.log(formStructur());
