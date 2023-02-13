const validateHierarchy = require("./src/rules/helper");

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
      return {
        ImportDeclaration: (node) =>
          importDeclaration({
            node,
            hierarchy,
            componentFolder,
            context,
          }),
        ImportExpression: (node) =>
          awaitExpression({
            node,
            hierarchy,
            componentFolder,
            context,
          }),
        VariableDeclaration: (node) =>
          variableDeclaration({
            node,
            hierarchy,
            componentFolder,
            context,
          }),
        CallExpression: (node) =>
          expressionStatement({
            node,
            hierarchy,
            componentFolder,
            context,
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
function awaitExpression({ node, hierarchy, componentFolder, context }) {
  let nodeValue = undefined;
  try {
    nodeValue = node.source.value;
  } catch {
    nodeValue = null;
  }

  if (nodeValue) {
    const pathToCurrentFile = adaptingTheImportPathForLinux(context.getFilename());
    const nodeValueName = nodeValue;
    const params = {
      pathToCurrentModule: pathToCurrentFile,
      importDefinitionPath: nodeValueName,
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
function expressionStatement({ node, hierarchy, componentFolder, context }) {
  const nameOperationIsRequire = node.callee?.name === "require";
  if (nameOperationIsRequire) {
    let nodeValue = undefined;
    try {
      nodeValue = node.expression.arguments[0].value;
    } catch {
      nodeValue = null;
    }

    if (nodeValue) {
      const pathToCurrentFile = adaptingTheImportPathForLinux(context.getFilename());
      const nodeValueName = nodeValue;
      const params = {
        pathToCurrentModule: pathToCurrentFile,
        importDefinitionPath: nodeValueName,
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
 *  function works with regular imports
 */

function importDeclaration({ node, hierarchy, componentFolder, context }) {
  const pathToCurrentFile = adaptingTheImportPathForLinux(context.getFilename());
  const nodeValueName = adaptingTheImportPathForLinux(node.source.value);
  const params = {
    pathToCurrentModule: pathToCurrentFile,
    importDefinitionPath: nodeValueName,
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
function variableDeclaration({ node, hierarchy, componentFolder, context }) {
  const checkVariableName = node.declarations[0].id?.name;
  if (checkVariableName) {
    let nodeValue = undefined;
    try {
      nodeValue = node.declarations[0].init.arguments[0].value;
    } catch {
      nodeValue = null;
    }

    if (nodeValue) {
      const pathToCurrentFile = adaptingTheImportPathForLinux(context.getFilename());
      const nodeValueName = nodeValue;
      const params = {
        pathToCurrentModule: pathToCurrentFile,
        importDefinitionPath: nodeValueName,
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
