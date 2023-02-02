const path = require("path");
const getImportError = require("./src/getImportError");
const getParentFolder = require("./src/helpers/getParentFolder");
const returnOfAllPossibleErrors = require("./src/rules/returnOfAllPossibleErrors");

module.exports = validateIfImportIsAllowed;

let jsConfigFileContent = undefined;

function validateIfImportIsAllowed(pathToCurrentModule, importDefinitionPath, levelsConfiguration, rootDirectory) {
  if (jsConfigFileContent === undefined) {
    setJsConfigFile();
  }

  let errorMessage = undefined

  const moduleIsInRootDirectory = Boolean(getParentFolder(rootDirectory, pathToCurrentModule));

  if (moduleIsInRootDirectory) {
    errorMessage = returnOfAllPossibleErrors(
      rootDirectory,
      importDefinitionPath,
      pathToCurrentModule,
      levelsConfiguration,
      jsConfigFileContent
    );
  }

  return errorMessage
}

function setJsConfigFile() {
  try {
    jsConfigFileContent = require(path.resolve("jsconfig.json"));
  } catch {
    jsConfigFileContent = null;
  }
}
