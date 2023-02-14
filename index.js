const validateHierarchy = require("./src");

const DEFAULT_HIERARCHY = {
  file: [
    {
      level: "D",
      children: [],
    },
    {
      level: "A",
      children: [],
    },
    {
      level: "B",
      children: [],
    },
    {
      level: "C",
      children: [],
    },
  ],
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
            pathToCurrentFile,
          }),
        ImportExpression: (node) =>
          importExpression({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile,
          }),
        // VariableDeclaration: (node) =>
        //   variableDeclaration({
        //     node,
        //     hierarchy,
        //     componentFolder,
        //     context,
        //     pathToCurrentFile,
        //   }),
        // ExpressionStatement: (node) =>
        //   expressionStatement({
        //     node,
        //     hierarchy,
        //     componentFolder,
        //     context,
        //     pathToCurrentFile,
        //   }),
        CallExpression: (node) =>
          callExpression({
            node,
            hierarchy,
            componentFolder,
            context,
            pathToCurrentFile,
          }),
      };
    },
  },
};

/**
 *  works with regular imports
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
 *
 * function works with async imports
 * node.source.value = import string value
 */
function importExpression({ node, hierarchy, componentFolder, context, pathToCurrentFile }) {
  let importDefinition = undefined;
  try {
    importDefinition = node.source.value;
  } catch {
    importDefinition = null;
  }

  if (importDefinition) {
    const importDefinitionPath = adaptingTheImportPathForLinux(importDefinition);
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

/**
 * function works with require without assigning to a variable
 * node.callee.name = transaction name
 */
function expressionStatement({ node, hierarchy, componentFolder, context, pathToCurrentFile }) {
  // const nameOperationIsRequire = node.expression?.callee?.name === "require";
  // if (nameOperationIsRequire) {
  //   let nodeValue = undefined;
  //   try {
  //     nodeValue = node.arguments[0].value;
  //   } catch {
  //     nodeValue = null;
  //   }
  //   if (nodeValue) {
  //     const importDefinitionPath = adaptingTheImportPathForLinux(nodeValue);
  //     const params = {
  //       pathToCurrentModule: pathToCurrentFile,
  //       importDefinitionPath: importDefinitionPath,
  //       levelsConfiguration: hierarchy,
  //       rootDirectory: componentFolder,
  //     };
  //     const error = validateHierarchy(params);
  //     if (error) {
  //       context.report(node, error);
  //     }
  //   }
  // }
}

/**
 * function works with require without assigning to a variable
 * node.callee.name = transaction name
 */
function callExpression({ node, hierarchy, componentFolder, context, pathToCurrentFile }) {
  const nameOperationIsRequire = node?.callee?.name === "require";
  if (nameOperationIsRequire) {
    let nodeValue = undefined;
    try {
      nodeValue = node.arguments[0].value;
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

function adaptingTheImportPathForLinux(path) {
  return path.split("\\").join("/");
}
