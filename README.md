# server-template - 一个简易的 node 服务器模板

## 主要目的

提供 ES 模块和 Typescript 的学习与 node web 的参考

## 运行/开发环境

nodejs >=14.17.1 (v14.17.1 经过测试)

## 运行

安装依赖

```
yarn install
```

运行 dev

```
npm run dev
```

build

```
npx tsc
```

## 依赖

### dev

- typescript <https://www.typescriptlang.org/>
- chokidar <https://www.npmjs.com/package/chokidar>

### build

- express <https://www.expressjs.com.cn>
- prettier <https://prettier.io/docs/en/install.html>
- colorette <https://www.npmjs.com/package/colorette>
- lowdb <https://www.npmjs.com/package/lowdb>
- mockjs <http://mockjs.com>

## 特点

- 热加载开发
- 使用 Typescript 开发
- 使用 es 模块开发
- 使用文件 nosql 数据库
- 层次化的 web 项目结构模板

## TODO

- 目前的热加载生成文件会出现在\_temp 目录。热加载本来想要使用内存文件系统。但是许多内置库都是直接使用 node 的 fs 引入导出真实的文件系统的。

## 项目结构

![默认流程](doc\imgs\server-template.jpg)

## 项目要点

### 使用 express 作为 web 服务器

- 使用了 Express 中间件，参考 [src\index.ts](src\index.ts)
  ```typescript
  const app = express();
  ...
  // 日志
  app.use(logMiddleware({}));
  // 验证
  app.use(validatorMiddleware);
  ```
- 通过 controller 注册访问 url，参考 [src\index.ts](src\index.ts)
  ```typescript
  const app = express();
  ...
  insertController(app);
  ```

### 数据来源

- mockjs 参考 [src\controller\FlowController.ts](src\controller\FlowController.ts)
  直接在控制层添加模拟数据
  ```typescript
  auditGroup.aduitors = Mock.mock({ "array|1-4": ["@name"] })["array"];
  ```
- lowdb
  **一个 data.json 文件看作一个数据库，data.json 的每个属性抽象地看成数据库的一张表，而每个 mapper 文件就用来操作对应的表。**
  1.  [src\data.json](src\data.json) **数据库文件结构**
  ```json
  { "flow": [], "auditGroup": [] }
  ```
  2.  [src\database\index.ts](src\database\index.ts) **在此引入数据库文件**
  ```typescript
  const file = join(dirname(import.meta.url), "data.json").replace(
     /(file:\\|\/)/,
     ""
  );
  ......
  const adapter = new JSONFile<Data>(file);
  ```
  3.  [src\database\model\Flow.ts](src\database\model\Flow.ts) **定义数据模型**
  ```typescript
  import { ModelBase } from "../../base/ModelBase";
  // 单例模式
  export const tableName = "flow";
  export class Flow extends ModelBase {
    static tableName: string = tableName;
    title: string;
    stage: string;
    auditGroupId: number;
    context: Array<any>;
    constructor() {
      super();
      this.id = null;
      this.stage = null;
      this.context = null;
      this.auditGroupId = null;
    }
  }
  ```
  4.  [src\database\mapper\FlowMapper.ts](src\database\mapper\FlowMapper.ts) **使用 mapper 操作数据库**(这里的具体操作都是通用的操作，所以放在了[src\base\MapperBase.ts](src\base\MapperBase.ts))
  ```typescript
  import { Flow } from "../model/Flow";
  import { MapperBase } from "../../base/MapperBase";
  export class FlowMapper extends MapperBase implements Flow {
    tableName: string = Flow.tableName;
    title: string;
    stage: string;
    context: any[];
    id: number;
    auditGroupId: number;
    constructor() {
      super();
      this.context = null;
      this.title = null;
      this.stage = null;
      this.id = null;
      this.auditGroupId = null;
    }
  }
  // 单例模式
  export const flowMapper = new FlowMapper();
  ```
  5.  [src\vo\FlowVo.ts](src\vo\FlowVo.ts) Vo 层，也是一种模型层，负责组合 model 层和过滤不需要的字段，比如用户信息不能带密码字段，用户信息还包含区域信息。
  ```typescript
  import { Flow } from "../database/model/Flow";
  import { AuditGroup } from "../database/model/AuditGroup";
  export class FlowVo extends Flow {
    aduitors: AuditGroup;
    constructor(flow: Flow, auditors: AuditGroup) {
      super();
      this.stage = flow.stage;
      this.context = flow.context;
      this.id = flow.id;
      this.auditGroupId = flow.auditGroupId;
      this.title = flow.title;
      this.aduitors = auditors;
    }
  }
  ```
  6.  [src\controller\FlowController.ts](src\controller\FlowController.ts) 具体的业务逻辑都放在了控制层，如果功能复杂可以独立一层业务层。
  ```typescript
  // 获得flow的vo信息
  app.route("/flow").get(async (req, res, next) => {
    await myNosql.read(); // lowdb的read是从文件读取数据到内存（即读取到myNosql.data）
    const flow = flowMapper.getById(Number(req.query.id));
    const auditGroup = auditGroupMapper.getById(flow.auditGroupId);
    auditGroup.aduitors = Mock.mock({ "array|1-4": ["@name"] })["array"];
    const result = new FlowVo(flow, auditGroup);
    res.type("application/json");
    res.json(Response.getSuccessInstance(result));
    res.end();
  });
  ```

### 热加载功能

- chokidar 提供了监视文件系统变化的功能 查看[script\dev\index.js](script\dev\index.js)

  ```javascript
  // 监听文件变化
  const file = join(dirname(import.meta.url), "../", "../", "src").replace(
    /(file:\\|\/)/,
    ""
  );
  const watcher = chokidar.watch(file, {
    ignored: /(node_modules)|(.json)$/, // ignore dotfiles
    persistent: true,
  });
  watcher.on("all", (event, path, stats) => {
    if (["change", "unlinkDir", "unlink"].includes(event)) {
      console.log("watching event:" + event + " path:" + path);
      debounceStartServer();
    }
  });
  ```

- TypesScript 提供了 compiler 的 Api ，参考用法[script\dev\typescript-compiler.js](script\dev\typescript-compiler.js)
  官网 APi[https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)

## 基础要点

1. [ESM node 项目启动 ESM 模块]() 设置 **package.json** 的 **type:module** 即可

   ```json
   {
      ......
      "name": "server-template",
      "type": "module",
      ......
   }
   ```

2. [ESM import 断言](https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#import-assertions) 导入 json 文件时需要断言。[例子:script/dev/typescript-compiler.js:59](script/dev/typescript-compiler.js)

   ```typescript
   import(configPath, { assert: { type: "json" } }).then((module) => { // 一些node版本要求断言
   ```

3. [ESM 获取当前模块路径](https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#importmeta) 使用 **import.meta.url**，可加载相对路径的文件，但注意这是带文件协议的 url。[例子: src/database/index.ts:14](src/database/index.ts)

   ```typescript
   const file = join(dirname(import.meta.url), "data.json").replace(
     /(file:\\|\/)/,
     ""
   );
   ```

4. [ESM 相对路径不能省略文件后缀名](https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#mandatory-file-extensions) 这与 Typescript 的路径编译矛盾 [issues](http://gihub.com/Microsoft/TypeScript/issues/13422)
   _src\index.ts_

   ```typescript
   // typescript
   import { Response } from "./base/ControllerBase";

   // 但是es模块要求
   import { Response } from "./base/ControllerBase.js";
   ```

   目前这里的解决办法是 执行 node 脚本时带上 --experimental-specifier-resolution=node [例子: package.json.scripts.dev](package.json)

   ```json
   {
     "scripts": {
       "dev": "node --experimental-specifier-resolution=node --trace-warnings script/dev/index"
     }
   }
   ```

5. [TypeScript 访问对象属性限制](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html#the-keyof-type-operator) **keyof**。 经常用于访问一些限制了属性的对象，但是访问属性未知的时候。例子: src/base/MapperBase.ts

   ```typescript
   type Point = { x: number; y: number };
   type P = keyof Point;
   ```

6. [TypeScript 类型断言](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) **as** [例子: src/base/MapperBase.ts](src/base/MapperBase.ts)

   ```typescript
   const x = "hello" as number; //将会出错
   const x = "hello" as string;
   ```

7. **type** 和 **interface** 只是类型判断，真正实例化有对象属性的还是要用 class。 因为有时需要遍历对象的所有属性

   ```typescript
   type t1 = {
     a: number;
     b: number;
   };
   class t1C implements t1 {
     a: number = 2;
     b: number = 1;
   }
   // typescript 转换后
   ("use strict");
   class t1C {
     constructor() {
       this.a = 2;
       this.b = 1;
     }
   }
   ```

8. [TypeScript 未知属性限制](https://www.typescriptlang.org/docs/handbook/2/classes.html#index-signatures)

   ```typescript
   interface WatchOptions {
     [option: string]: number | undefined;
   }

   let aa: WatchOptions = {
     option: 2,
     option2: 2,
     2: "2", // typescript报错
     sa: "2", // typescript报错
   };
   ```

9. [构造函数外初始化属性](https://www.typescriptlang.org/docs/handbook/2/classes.html#--strictpropertyinitialization)

```typescript
class OKGreeter {
  // Not initialized, but no error
  name!: string;
}
```

11. **类的静态属性提供类型检查**

```typescript
class c1 {
  static c1s: number = 2;
  static c2s: number = 3;
  static c3s: number = 4;
}
// 此时的a想要检查到c1的静态属性，除了使用any那么要怎么声明a？
function gf(a: any) {
  a.c1s;
}
gf(c1);

// 解决办法是为这个class的静态属性再次声明一个type
type c1StaticType = {
  c1s: number;
  c2s: number;
  c3s: number;
};
function gf(a: c1StaticType) {
  a.c1s;
}
gf(c1);
```
