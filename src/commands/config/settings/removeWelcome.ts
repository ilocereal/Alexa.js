import {Message} from "discord.js";
import {gb} from "../../../misc/Globals";
import {Guild} from "../../../database/models/guild";
import safeSendMessage from "../../../handlers/safe/SafeSendMessage";
import {ORMUpdateResult} from "../../../database/Database";



export default function removeWelcome(message: Message){
    gb.database.removeWelcomeChannel(message.guild.id).then((r: ORMUpdateResult<Guild>) => {
        safeSendMessage(message.channel, `That setting is now gone`);
    });
}
