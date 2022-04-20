import ts from "typescript";
import { join } from "path";
export const outDir = "_temp";

/**
 * 调用typescript的编译接口
 * see: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
 * @param {string[]} fileNames
 * @param { ts.CompilerOptions} options
 * @returns void
 */
function compile(fileNames, options, callback) {
  console.log("get compile options!");
  const host = ts.createCompilerHost(options);
  // host.writeFile = myWriteFile
  let program = ts.createProgram(fileNames, options, host);
  console.log("start compliing!");
  let emitResult = program.emit();
  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });
  console.log("compile end!");
  callback && callback();
}
/**
 *
 * @param {string} mainPath
 * @param {string} configPath
 * @returns void
 */
export function compileWidthConfig({
  mainPath = join("src", "index.ts"),
  configPath = "../../tsconfig.json",
  callback,
}) {
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }
  // import(configPath, { assert: { type: "json" } }).then((module) => { // 一些node版本要求断言
  import(configPath).then((module) => {
    const compilerOptions = module.default.compilerOptions;
    compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
    compilerOptions.module = ts.ModuleKind.ES2020;
    compilerOptions.target = ts.ScriptTarget.ES2020;
    compilerOptions.outDir = outDir;
    compile([mainPath], compilerOptions, callback);
  });
}
