import path from "path";
/**
 * 写入到memfs
 * @param {string} fileName
 * @param {string} data
 * @param {fs} fs
 */
export function writeFile(fileName, data, fs) {
  let fd;
  const _writeFun = () => {
    const dirname = path.dirname(fileName);
    !fs.existsSync(dirname) && fs.mkdirSync(dirname, { recursive: true });
    fd = fs.openSync(fileName, "w");
    fs.writeSync(fd, data, undefined, "utf8");
  };
  try {
    _writeFun();
  } finally {
    fd !== undefined && fs.closeSync(fd);
  }
}
