import {Guild, RichEmbed} from "discord.js";
import {warningEmbedColor} from "../../utility/Settings";

export default function infractionDMEmbed(guild: Guild, weight: number, reason: string, currentStrikes: number, strikeCap: number){
    return new RichEmbed()
        .setTitle(`Moderator Warning!`)
        // TODO: add personalized warning messages
        .setDescription(
            `You've been warned by a moderator in **${guild.name}** with weight **${weight}**.\n` +
            `In **${guild.name}**, you are given a maximum of ${strikeCap} strikes before you are banned.\n` +
            `Make sure to go over the server's rules to avoid further warnings.`)
        .setColor(warningEmbedColor)
        .addField(`__Weight__`, weight, true)
        .addField(`__Current Strikes__`, `${currentStrikes}/${strikeCap}`, true)
        .addField(`__Reason__`, reason);
    // TODO: add $appeal
}
