import { EventDispatcher } from "../../Base/EventDispatcher";

class ReadyEvent extends EventDispatcher {
    execute() {
        this.client.logger.info(`Logged in as ${this.client.user?.tag}!`);

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
