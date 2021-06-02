import { EventDispatcher } from "../../Base/EventDispatcher";

class ReadyEvent extends EventDispatcher {
    execute() {
        this.client.logger.success(`[${new Date().toLocaleString()}] Logged in as ${this.client.user?.tag}!`);

        void this.client.user?.setPresence({
            activities: [
                {
                    name: `${this.client.config.DEFAULT_PREFIX}help`,
                    type: "COMPETING"
                }
            ],
            status: "dnd"
        });
    }
}

export default ReadyEvent;
