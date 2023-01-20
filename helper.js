const path = require("path");
const fs = require("fs");
const TreeModel = require("tree-model");
module.exports = validateIfImportIsAllowed;

function validateIfImportIsAllowed(pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory) {
  const currentModuleIsInRootDirectory = Boolean(
    new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(pathToCurrentModule)
  );

  if (currentModuleIsInRootDirectory) {
    const partsOfPathToCurrentModule = pathToCurrentModule.split("/");
    const architectureConfigTree = [];
    function getArchitectureConfigurationTree(architectureConfigRules) {
      for (let key in architectureConfigRules) {
        const lastParent = getAllParentThisNode(
          levelsConfiguration.file,
          architectureConfigRules[key].level
        ).lastParent;
        const firstParent = getAllParentThisNode(
          levelsConfiguration.file,
          architectureConfigRules[key].level
        ).firstParent;
        architectureConfigTree.push({
          name: architectureConfigRules[key].level,
          index: key,
          parents: lastParent || rootDirectory,
          firstParent: firstParent,
          children: architectureConfigRules[key].children
        });
        if (architectureConfigRules[key].children.length !== 0) {
          getArchitectureConfigurationTree(architectureConfigRules[key].children);
        }
      }
      return architectureConfigTree;
    }

    // не все папки указаны в конфиге!
    // модуль может не принадлежать ни одному уровню!

    const currentModuleLevel = partsOfPathToCurrentModule[partsOfPathToCurrentModule.length - 2];
    // console.log(currentModuleLevel);

    if (currentModuleLevel) {
      const configurationTree = getArchitectureConfigurationTree(levelsConfiguration.file);
      // console.log(configurationTree);

      const currentModuleLevelConfiguration = configurationTree.find((elem) => elem.name === currentModuleLevel);
      console.log(currentModuleLevel);

      const targetModuleLevel = checkTargetModuleLevel(configurationTree, importDefinitionPath);
      if (targetModuleLevel) {
        const parentTargetModule = configurationTree.find((elem) => elem.name === targetModuleLevel[1]);
        const partsOfPathToTargetModule = importDefinitionPath.split("/");
        const importLevel = partsOfPathToTargetModule[partsOfPathToTargetModule.length - 2]; 
        console.log(partsOfPathToTargetModule);
        // console.log(partsOfPathToTargetModule);
        const configurationOfTargetModule = configurationTree.find((elem) => elem.name === importLevel);
        //console.log(configurationOfTargetModule);

        if (configurationOfTargetModule) {
         // console.log(configurationOfTargetModule);
          //console.log(currentModuleLevelConfiguration);
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
              return "qqqqqqqqqqqqqqqqqqqqqqqqqqqq";
            }
          }
        } else {
          const configurationTree = getArchitectureConfigurationTree(levelsConfiguration.file);
          const absolutePathToTheFile  = path.resolve(pathToCurrentModule, importDefinitionPath)
          const absoluteTargetPathToTheFile = absolutePathToTheFile.split("/").splice(0, absolutePathToTheFile.split("/").length - 3).join("/")
          const absolutePathToTheFile2  = path.resolve(absoluteTargetPathToTheFile, importDefinitionPath)
          //const lastParent = absolutePathToTheFile.split('/')[absolutePathToTheFile.split('/').length - 3]
          const firstParent = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(absolutePathToTheFile)
          //const nameTargetFolder = absolutePathToTheFile.split('/')[absolutePathToTheFile.split('/').length - 2]
          const moduleTargetLevelFirstName = configurationTree.find((elem) => elem.name === firstParent[1]); //что импортим
          const firstParentcCurrentLevel =  new RegExp(`${moduleTargetLevelFirstName.name}\\/(\\w+)/(\\w+)`, "g").exec(absolutePathToTheFile)
          console.log(firstParentcCurrentLevel);
          const moduleCurrentLevelFirstName = configurationTree.find((elem) => elem.name === firstParentcCurrentLevel[2]) //куда
          console.log(moduleTargetLevelFirstName, moduleCurrentLevelFirstName);
          console.log(moduleTargetLevelFirstName, moduleCurrentLevelFirstName, absolutePathToTheFile);
          //console.log(a);
          if (moduleTargetLevelFirstName.name !== moduleCurrentLevelFirstName.name) {
            if (moduleCurrentLevelFirstName.index > moduleTargetLevelFirstName.index) {
              //console.log(firstParentModalofTheNonSpecifiedInRules, firstParentCurrentModuleLevelConfiguration);
              return `adasdasdasdasd`;
            }

          }
          // function flatten(lists) {
          //   return lists.reduce((a, b) => a.concat(b), []);
          // }

          // function getDirectories(srcpath) {
          //   return fs
          //     .readdirSync(srcpath)
          //     .map((file) => path.join(srcpath, file))
          //     .filter((path) => fs.statSync(path).isDirectory());
          // }

          // function getDirectoriesRecursive(srcpath) {
          //   return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
          // }
          // const parentAndNameFolder = []
          // function getParentsAndNameFolder(root) {
          //  //const name = importDefinitionPath.split("/");
          //   for (let key in architectureConfigTree) {
          //     const pathConfigurationOfTargetModule = getDirectoriesRecursive(
          //       path.resolve(root, architectureConfigTree[key].name)
          //       );
          //       parentAndNameFolder.push(pathConfigurationOfTargetModule)
          //   }
          //   let allFolders = parentAndNameFolder.reduce((a, b) => a.concat(b), [])
          //      //const firstParentModalofTheNonSpecifiedInRules = new RegExp(`${rootDirectory}\\/(\\w+)`, "g").exec(pathConfigurationOfTargetModule[key])
          //   return allFolders
          //   //  for (let key in pathConfigurationOfTargetModule) {
          //   //   const pathModal = pathConfigurationOfTargetModule[key].split("/")
          //   //   parentAndNameFolder.push({name: pathModal[pathModal.length - 1], firstParent: firstParentModalofTheNonSpecifiedInRules[1]})
          // }
          // console.log(getParentsAndNameFolder(rootDirectory));
          //return parentAndNameFolder
          //  }
          // const path1 = pathConfigurationOfTargetModule.split("/")
          //  const nameFolder = path1[path1.length - 1]
          //const firstParentModalofTheNonSpecifiedInRules = targetModuleLevel
          //  const targetLevel = [{name: path1[path1.length - 1], firstParent: path1[0] }]
          //console.log(pathConfigurationOfTargetModule);
         // const allModalofTheNonSpecifiedInRules = getParentsAndNameFolder();
          // const firstParentModalofTheNonSpecifiedInRules = allModalofTheNonSpecifiedInRules.find((elem) => elem.name === name[name[length -1 ]])
          // const firstParentCurrentModuleLevelConfiguration = configurationTree.find((elem) => elem.name === currentModuleLevelConfiguration.firstParent)
         
        } //else if (currentModuleLevelConfiguration.parents !== configurationOfTargetModule.parents) {
        //   if (parentTargetModule.index >=  currentModuleLevelConfiguration.index) {
        //     return `???????????????????????`
        //   }
        // }
      }
    }
  }
}

function checkTargetModuleLevel(configurationTree, importDefinitionPath) {
  const levelsNames = configurationTree.map((levelConfiguration) => levelConfiguration.name);

  const levelsNamesString = levelsNames.reduce((acc, cur) => {
    return `${acc}|${cur}`;
  });

  const targetModuleLevel = new RegExp(`(${levelsNamesString})`, "g").exec(importDefinitionPath);
  //console.log(targetModuleLevel);
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
