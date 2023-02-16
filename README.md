# eslint-plugin-architector

The Dependency Rule states that the source code dependencies can only point inwards.

![Image alt](https://github.com/artemkuskin/img/blob/main/1%200u-ekVHFu7Om7Z-VTwFHvg.webp)

This means nothing in an inner circle can know anything at all about something in an outer circle. i.e. the inner circle shouldn’t depend on anything in the outer circle. The Black arrows represented in the diagram show the dependency rule.

The plugin supports aliases that you specify in "jsconfig.json"

## installation

```
npm install artemkuskin/eslint-plagin-architector
```

## Usage

Add the plugin to your eslint config file

```
"plugins": [
    "eslint-plugin-architector-import"
],
```

Next, enable the rule

`"architector-import/architector-import": "error"`

## Configuring

### default values

```
component folder: 'components'

design hierarchy:
levels: [
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

```

### options

You can change the hierarchy, both levels and child levels are configurable. The plugin will only check imports in these folders, located in the components folder.

You can also change the name of the root component folder. The plugin will only check files and import in this folder.

`"level"` - Folder name(Required field).

`"children"` - Array with child folders (Required if there are no child levels- "children": []).

`"errorPostfix"` - The message that will be shown with an error if the import is not correct (Optional field).

`"independentChildren"`: true,- This setting will allow you to import all child levels into each other, regardless of the hierarchy, but not deeper than one level of nesting (Optional field).

```
     "architector-import/architector-import": [
      "error",

      {
        "errorPostfix": "see www.wiki for details.",
        "levels": [
            {
            "level": "A",
            "independentChildren": true,
            "children": [
              {
                "level": "A1",
                "children": [
                  {
                    "level": "A2",
                    "children": []
                  },
                  {
                    "level": "A5",
                    "children": []
                  }
                ]
              },
              {
                "level": "A3",
                "children": []
              }
            ]
          },
          {
            "level": "B",
            "children": [
              {
                "level": "B1",
                "children": []
              },
              {
                "level": "B5",
                "children": []
              }
            ]
          },
          {
            "level": "C",
            "children": []
          },
          {
            "level": "D",
            "children": []
          },

        ]
      },

      "components"
    ]
```

## Example 1

`**/components/**/A/A.js`
Level "A" is the highest in the tree, so only its children can be imported into it

```
// valid, A can import childrens  Level A
import { A1 } from "./A1/A1.js";
import { A2 } from "./A1/A2/A2.js";
import { A3 } from "A3/A3.js"; - Aliase

// valid, A can import B, C
import {B} from "../B/B.js";
import {C} from "C/C.js"; - Aliase

// invalid, A can't import "children" Level B
import { B1 } from "B1/B1.js"; - Aliase

```

## Example 2

`**/components/**/B/B1/B1.js`
Level "B1" is a child of level "B", level "B" is above "D" and "C", but below "A", so it can import "A" and its children

```
// valid, B can import childrens Level A and Level A
import { A } from "../../A/A.js";
import { A1 } from "../../A/A1/A1.js";


// invalid, B can't import  Level B and Level C
import { B } from "../B.js";
import { C } from "C/C.js";

```

## Example 3

`**/components/**/D/D.js`
Level "D" is below all levels in the rules tree, so you can import all levels into it

```
// valid, B can import childrens Level A and Level A
import { B1 } from "B1/B1.js";
import { A } from "../A/A.js";
import { A1 } from "../A/A1/A1.js";
import { B } from "../B/B.js";
import { A3 } from "A3/A3.js";
```
