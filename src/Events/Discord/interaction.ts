import { Interaction } from "discord.js";
import { EventDispatcher } from "../../Base/EventDispatcher";

class InteractionEvent extends EventDispatcher {
    execute(interaction: Interaction) {
        if (interaction.isCommand() || interaction.isMessageComponent()) return interaction.reply("Hello", { ephemeral: true });
    }
}

export default InteractionEvent;
