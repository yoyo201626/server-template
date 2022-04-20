import { compileWidthConfig, outDir } from "./typescript-compiler";
import chokidar from "chokidar";
import { join, dirname, normalize } from "path";
// 节流启动
let compilingFlag = false;
let savingEvent = null;
const debounceStartServer = (function () {
  const mainPath = "../" + "../" + outDir + "/index.js";
  const callback = () => {
    console.log("import compiled file");
    import(mainPath)
      .then((module) => {
        console.log("start server from: ", mainPath);
        module.startServer();
        savingEvent && savingEvent({ callback: callback });
        savingEvent = null;
        compilingFlag = false;
      })
      .catch((err) => {
        console.err(err);
        savingEvent = null;
        compilingFlag = false;
      });
  };
  return () => {
    if (compilingFlag === false) {
      compilingFlag = true;
      try {
        compileWidthConfig({ callback: callback });
      } catch (err) {
        console.err(err);
        savingEvent = null;
        compilingFlag = false;
      }
    } else {
      savingEvent = compileWidthConfig;
    }
  };
})();

debounceStartServer();
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
