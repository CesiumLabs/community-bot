import chalk from "chalk";
import util from "util";

class Logger extends console.Console {
    constructor(output?: NodeJS.WritableStream | null) {
        super({
            stdout: output ?? process.stdout
        });
    }

    log(message?: any) {
        super.log(chalk.whiteBright(typeof message === "string" ? message : util.inspect(message)));
    }

    error(message?: any) {
        super.error(chalk.redBright(typeof message === "string" ? message : util.inspect(message)));
    }

    warn(message?: any) {
        super.warn(chalk.magentaBright(typeof message === "string" ? message : util.inspect(message)));
    }

    info(message?: any) {
        super.log(chalk.blueBright(typeof message === "string" ? message : util.inspect(message)));
    }

    success(message?: any) {
        super.log(chalk.greenBright(typeof message === "string" ? message : util.inspect(message)));
    }

    debug(message?: any) {
        super.log(chalk.yellowBright(typeof message === "string" ? message : util.inspect(message)));
    }
}

export { Logger };
