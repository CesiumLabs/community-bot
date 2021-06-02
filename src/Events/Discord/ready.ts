import { EventDispatcher } from "../../Base/EventDispatcher";

class ReadyEvent extends EventDispatcher {
    execute() {
        this.client.logger.success(`[${new Date().toLocaleString()}] Logged in as ${this.client.user?.tag}!`);
    }
}

export default ReadyEvent;
