import { join, dirname, resolve } from "path";
import path from "path";

// const file = join('src', "data.json")
const file2 = "./data.json";
const file = path.resolve(join(dirname(import.meta.url), "data.json"));
path.basename("");
