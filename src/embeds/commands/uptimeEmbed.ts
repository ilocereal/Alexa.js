
import {RichEmbed} from "discord.js";
import {commandEmbedColor} from "../../utility/Settings";

/**
 *
 * @param {string} uptime - formatted time string
 */
export default function uptimeEmbed(uptime: string){
    return new RichEmbed()
        .addField(`Up and running!`,`I've been online for **${uptime}**`)
        .setColor(commandEmbedColor)
}
