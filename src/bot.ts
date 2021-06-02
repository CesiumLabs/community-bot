import { Weeknd } from "./Base/Weeknd";
import "./Structures/Guild";
import "./Structures/GuildMember";
import "./Structures/Message";
import "./Structures/User";

const weeknd = new Weeknd();

weeknd.database.on("ready", () => {
    weeknd.logger.info(`[${new Date().toLocaleString()}] Connected to the database!`);
});

export { weeknd };
