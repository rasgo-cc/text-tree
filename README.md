# text-tree

### Parsing tree data structures from simple text files.

- **Auto-detects** identation (**tabs** or **spaces**)
- Uses **streams**
- **Customizable** resulting node **keys** (e.g. `id`, `children`)
- Supports any kind of serializable data for each node's data
- Written in **TypeScript**

Every node must have a unique ID. Each node has its own data and contains a reference for its parent and children.

## Example

```
$ touch data.txt

A
    B
        C
    D
E
    F
```

```ts
import { parseFile } from "text-tree";

const result = parseFile("./data.txt");
console.log(result);

[
  {
    data: "A",
    id: "A",
    parentId: null,
    children: [
      {
        data: "B",
        id: "B",
        parentId: "A",
        children: [
          {
            data: "C",
            id: "C",
            parentId: "B",
            children: []
          }
        ]
      },
      {
        data: "D",
        id: "D",
        parentId: "A",
        children: []
      }
    ]
  },
  {
    data: "E",
    id: "E",
    parentId: null,
    children: [
      {
        data: "F",
        id: "F",
        parentId: "E",
        children: []
      }
    ]
  }
];
```

## API

```ts
parseFile(filePath: string, config: Partial<Config> = {}): Promise<any[]>
parseStream(stream: fs.ReadStream, config: Partial<Config> = {}): Promise<any[]>
```

## Configuration

```ts
type TreeNodeId = string | number | null;

interface Config {
  keys: Partial<{
    id: string;
    parentId: string;
    children: string;
    data: string;
  }>;
  tab: Partial<{
    insertSpaces: boolean;
    size: number;
    autoDetect: boolean;
  }>;
  getId: (data: any) => TreeNodeId;
}
```

By default, `getId` returns the whole node's data. In the example above, the data is a simple string (a letter), and as such, that would be the `id`. However, data can be parsed through `getId` in order to parse the data and get a custom id.

## Life

```
              _{\ _{\{\/}/}/}__
             {/{/\}{/{/\}(\}{/\} _
            {/{/\}{/{/\}(_)\}{/{/\}_
         {\{/(\}\}{/{/\}\}{/){/\}\} /\}
        {/{/(_)/}{\{/)\}{\(_){/}/}/}/}
       _{\{/{/{\{/{/(_)/}/}/}{\(/}/}/}
      {/{/{\{\{\(/}{\{\/}/}{\}(_){\/}\}
      _{\{/{\{/(_)\}/}{/{/{/\}\})\}{/\}
     {/{/{\{\(/}{/{\{\{\/})/}{\(_)/}/}\}
      {\{\/}(_){\{\{\/}/}(_){\/}{\/}/})/}
       {/{\{\/}{/{\{\{\/}/}{\{\/}/}\}(_)
      {/{\{\/}{/){\{\{\/}/}{\{\(/}/}\}/}
       {/{\{\/}(_){\{\{\(/}/}{\(_)/}/}\}
         {/({/{\{/{\{\/}(_){\/}/}\}/}(\}
          (_){/{\/}{\{\/}/}{\{\)/}/}(_)
            {/{/{\{\/}{/{\{\{\(_)/}
             {/{\{\{\/}/}{\{\\}/}
              {){/ {\/}{\/} \}\}
     apple --> (_) \.-'.-/
          __...--- |'-.-'| --...__
   _...--"   .-'   |'-.-'|  ' -.  ""--.._
 -"    ' .  . '    |.'-._| '  . .  '
 .  '-  '    .--'  | '-.'|    .  '  . '
          ' ..     |'-_.-|
  .  '  .       _.-|-._ -|-._  .  '  .
              .'   |'- .-|   '.
  ..-'   ' .  '.   `-._.-´   .'  '  - .
   .-' '        '-._______.-'     '  .
      worm --> ~,
    .       .   |\   .    ' '-.
    ___________/  \____________
   /  Why is it, when you want \
  |  something, it is so damn   |
  |    much work to get it?     |
   \___________________________/
```

## License

MIT
