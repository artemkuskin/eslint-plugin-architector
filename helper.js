const TreeModel = require("tree-model");
const path = require('path');
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
        const lastParent = getAllParentThisNode(levelsConfiguration.file, architectureConfigRules[key].level);
        architectureConfigTree.push({
          name: architectureConfigRules[key].level,
          index: key,
          parents: lastParent || rootDirectory,
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

  //  console.log( path.resolve(__dirname, importDefinitionPath));
    if (currentModuleLevel) {
      const configurationTree = getArchitectureConfigurationTree(levelsConfiguration.file);
      //console.log(configurationTree);

      const currentModuleLevelConfiguration = configurationTree.find((elem) => elem.name === currentModuleLevel);
      const asd = path.resolve(__dirname, importDefinitionPath).split("/")
      const targetModuleLevel = {name: asd[asd.length - 2], index: 0, parent: asd[asd.length - 3]}
      if (targetModuleLevel) {
        const parentTargetModule = {name: asd[asd.length - 2], index: 0, parents: asd[asd.length - 3]}
        const partsOfPathToTargetModule = importDefinitionPath.split("/");
        const importLevel = partsOfPathToTargetModule[partsOfPathToTargetModule.length - 2]; //куда импортим
        // console.log(partsOfPathToTargetModule);
        const configurationOfTargetModule = configurationTree.find((elem) => elem.name === importLevel);
        //console.log(configurationOfTargetModule);
        console.log(currentModuleLevelConfiguration);
        console.log(configurationOfTargetModule);
        console.log(parentTargetModule);
        if (configurationOfTargetModule) {
          if (currentModuleLevelConfiguration.parents === configurationOfTargetModule.parents) {
            if (configurationOfTargetModule.index >= currentModuleLevelConfiguration.index) {
              return `Cannot import ${importLevel} from ${currentModuleLevel}`;
            }
          }
          if (currentModuleLevelConfiguration.name !== configurationOfTargetModule.parents) {
            return `import prohibited due to different nesting levels`;
          }
        } else {
          if (currentModuleLevelConfiguration.parents === parentTargetModule.parents) {
            if (parentTargetModule.index >= currentModuleLevelConfiguration.index) {
              return `???????????????????????`;
            }
          }
          if (currentModuleLevelConfiguration.name !== configurationOfTargetModule.parents) {
            return "xzxxxxxxxxxxx";
          }
          // } else if (currentModuleLevelConfiguration.parents !== parentTargetModule.parents)
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

  return parents[parents.length - 2];
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