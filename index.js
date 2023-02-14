const validateHierarchy = require("./src");

const DEFAULT_HIERARCHY = {
  atoms: 0,
  molecules: 1,
  organisms: 2,
  templates: 3,
  pages: 4,
};

const DEFAULT_COMPONENTS_FOLDER = "components";

module.exports.rules = {
  "architector-import": {
    meta: {
      schema: [
        {
          type: "object",
          additionalProperties: true,
        },
        {
          type: "string",
        },
      ],
    },
    create: (context) => {
      const hierarchy = context.options[0] || DEFAULT_HIERARCHY;
      const componentFolder = context.options[1] || DEFAULT_COMPONENTS_FOLDER;
      const pathToCurrentFile = adaptingTheImportPathForLinux(context.getFilename());
      return {
        ImportDeclaration: (node) =>
          importDeclaration({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile
          }),
        ImportExpression: (node) =>
          importExpression({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile
          }),
        VariableDeclaration: (node) =>
          variableDeclaration({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile
          }),
        CallExpression: (node) =>
          expressionStatement({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile
          }),
      };
    },
  },
};

function adaptingTheImportPathForLinux(path) {
  return path.split("\\").join("/");
}
/**
 *
 * function works with async imports
 * node.source.value = import string value
 */
function importExpression({ node, hierarchy, componentFolder, context, pathToCurrentFile }) {
  let nodeValue = undefined;
  try {
    nodeValue = node.source.value;
  } catch {
    nodeValue = null;
  }

  if (nodeValue) {
    const importDefinitionPath = adaptingTheImportPathForLinux(nodeValue);
    const params = {
      pathToCurrentModule: pathToCurrentFile,
      importDefinitionPath: importDefinitionPath,
      levelsConfiguration: hierarchy,
      rootDirectory: componentFolder,
    };
    const error = validateHierarchy(params);
    if (error) {
      context.report(node, error);
    }
  }
}

/**
 * function works with require without assigning to a variable
 * node.callee.name = transaction name
 */
function expressionStatement({ node, hierarchy, componentFolder, context, pathToCurrentFile }) {
  const nameOperationIsRequire = node.callee?.name === "require";
  //if (nameOperationIsRequire) {
    let nodeValue = undefined;
    try {
      nodeValue = node.expression.arguments[0].value;
    } catch {
      nodeValue = null;
    }

    if (nodeValue) {
      const importDefinitionPath = adaptingTheImportPathForLinux(nodeValue);
      const params = {
        pathToCurrentModule: pathToCurrentFile,
        importDefinitionPath: importDefinitionPath,
        levelsConfiguration: hierarchy,
        rootDirectory: componentFolder,
      };
      const error = validateHierarchy(params);
      if (error) {
        context.report(node, error);
      }
    }
 // }
}

/**
 *  function works with regular imports
 */

function importDeclaration({ node, hierarchy, componentFolder, context, pathToCurrentFile }) {
  const importDefinitionPath = adaptingTheImportPathForLinux(node.source.value);
  const params = {
    pathToCurrentModule: pathToCurrentFile,
    importDefinitionPath: importDefinitionPath,
    levelsConfiguration: hierarchy,
    rootDirectory: componentFolder,
  };
  const error = validateHierarchy(params);
  if (error) {
    context.report(node, error);
  }
}

/**
 * the function works with require with assignment to a variable
 * node.declarations[0].id?.name = name variable
 */
function variableDeclaration({ node, hierarchy, componentFolder, context, pathToCurrentFile }) {
  const checkVariableName = node.declarations[0].id?.name;
  if (checkVariableName) {
    let nodeValue = undefined;
    try {
      nodeValue = node.declarations[0].init.arguments[0].value;
    } catch {
      nodeValue = null;
    }

    if (nodeValue) {
      const importDefinitionPath = adaptingTheImportPathForLinux(nodeValue);
      const params = {
        pathToCurrentModule: pathToCurrentFile,
        importDefinitionPath: importDefinitionPath,
        levelsConfiguration: hierarchy,
        rootDirectory: componentFolder,
      };
      const error = validateHierarchy(params);
      if (error) {
        context.report(node, error);
      }
    }
  }
}
