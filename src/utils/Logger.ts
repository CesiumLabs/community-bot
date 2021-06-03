import chalk from "chalk";
import util from "util";

const append = (m: string) => `[${new Date().toLocaleString()}] | ${m}`;

class Logger extends console.Console {
    constructor(output?: NodeJS.WritableStream | null) {
        super({
            stdout: output ?? process.stdout
        });
    }

    log(message?: any) {
        super.log(chalk.whiteBright(append(typeof message === "string" ? message : util.inspect(message))));
    }

    error(message?: any) {
        super.error(chalk.redBright(append(typeof message === "string" ? message : util.inspect(message))));
    }

    warn(message?: any) {
        super.warn(chalk.magentaBright(append(typeof message === "string" ? message : util.inspect(message))));
    }

    info(message?: any) {
        super.log(chalk.blueBright(append(typeof message === "string" ? message : util.inspect(message))));
    }

    success(message?: any) {
        super.log(chalk.greenBright(append(typeof message === "string" ? message : util.inspect(message))));
    }

    debug(message?: any) {
        super.log(chalk.yellowBright(append(typeof message === "string" ? message : util.inspect(message))));
    }
}

export { Logger };
