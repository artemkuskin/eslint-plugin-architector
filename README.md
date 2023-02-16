# eslint-plagin-architector

Плагин поддерживающий иерархию вашего приложения. Плагин позволяет вам выстраивать иерархию вашего предложения и запрещает импорты если они противоречат вашим настройкам. Импотры запрещаются в папки которые находятся выше в дереве правил или являются родительскими

Плагин поддерживает Алиасы которые вы укажите в "jsconfig.json"

## installation

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

Вы можете изменить иерархию, настраиваются как уровни, так и уровни детей. Плагин будет проверять импорт только в этих папках, расположенных в папке компонентов.

Вы также можете изменить имя папки корневых компонентов. Плагин будет проверять файлы и импортировать только в этой папке.
`"level" - имя папки(Обязательное поле).`
`"children" - массив с дочерними папками (Обязательное поле, если нет дочерних уровней - "children": []).`
`"errorPostfix" - сообщение которое будет показываться с ошибкой при не правильном импорте(Не обязательное поле).`
`"independentChildren": true,- эта настройка позволит импортировать все дочерние уровни друг в друга не зависимо от иерархии , но не глубже чем на один уровень вложенности(Не обязательное поле).`

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

      "src"
    ]
```

## Examples 1

`**/components/**/A/A.js`
`Модуль А находится выше всех в дереве, значит в него могут импортироваться только его дочерние уровни`

```
// valid, A can import "childrens"  Module A
import { A1 } from "./A1/A1.js";
import { A2 } from "./A1/A2/A2.js";
import { A3 } from "A3/A3.js"; - Aliase

// valid, A can import B, C
import {B} from "../B/B.js";
import {C} from "C/C.js"; - Aliase

// invalid, A can't import "children" Module B
import { B1 } from "B1/B1.js"; - Aliase

```

## Examples 2

`**/components/**/B/B1/B1.js`
`Модуль B1 является дочерним В, В находится выше D и С , но ниже А , значит в него могут импортироваться А и его дочерние элементы `

```
// valid, B can import "childrens" Module A and Module A
import { A } from "../../A/A.js";
import { A1 } from "../../A/A1/A1.js";


// invalid, B can't import  Module B and Module C
import { B } from "../B.js";
import { C } from "C/C.js";

```

## Examples 3

`**/components/**/D/D.js`
`Модуль D находиться ниже всех в дереве правил, згачит в него можно импортировать все модули`

```
// valid, B can import "childrens" Module A and Module A
import { B1 } from "B1/B1.js";
import { A } from "../A/A.js";
import { A1 } from "../A/A1/A1.js";
import { B } from "../B/B.js";
import { A3 } from "A3/A3.js";
```
