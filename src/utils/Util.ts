import yaml from "yaml";
import { readFileSync } from "fs";

class Util {
    static parseYAML<T = any>(file: string): T {
        const fileContent = readFileSync(file, "utf-8");

        return yaml.parse(fileContent);
    }

    static hideProp(src: any, target: string) {
        Object.defineProperty(src, target, { writable: true, configurable: true, enumerable: false });
    }
}

export { Util };
