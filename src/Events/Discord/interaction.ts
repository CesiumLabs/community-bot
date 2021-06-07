import { EventDispatcher } from "../../Base/EventDispatcher";
import { Interaction } from "discord.js";

class InteractionEvent extends EventDispatcher {
    execute(interaction: Interaction) { /* no-op for now */ }
}

export default InteractionEvent;
