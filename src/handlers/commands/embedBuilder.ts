import {TemplatedMessage} from "../../parsers/parsers.interface";
import templateParser from "../../parsers/templateParser";
import {ColorResolvable, Message, RichEmbed} from "discord.js";
import {handleFailedCommand} from "../../embeds/commands/commandExceptionEmbed";
import safeSendMessage from "../safe/SafeSendMessage";
import gb from "../../misc/Globals";

enum IEmbedBuilderErrors {
    INVALID_COLOR = 'invalid color'
}

export default class EmbedBuilder {
    public embeds: {[id: string]: TemplatedMessage} = {};
    private static _instance: EmbedBuilder;
    private constructor(){}
    public static getInstance(){
        if (!EmbedBuilder._instance){
            EmbedBuilder._instance = new this();
        }
        return EmbedBuilder._instance;
    }
    fields = () => {
        const fields = [];
        for (let i=1; i <= 9; ++i){
            fields.push('field' + i);
        }
        return fields;
    };

    values = () => {
        const values = [];
        for (let i=1; i <= 9; ++i){
            values.push('value' + i);
        }
        return values;
    };

    private checkValidColor(color: string){
        const int = Number(color);

        return Number.isInteger(int) || (['AQUA' ,'GREEN' ,'BLUE' ,'PURPLE' ,'GOLD' ,'ORANGE' ,'RED'
        ,'GREY' ,'DARKER_GREY' ,'NAVY' ,'DARK_AQUA' ,'DARK_GREEN' ,'DARK_BLUE'
        ,'DARK_PURPLE' ,'DARK_GOLD' ,'DARK_ORANGE' ,'DARK_RED' ,'DARK_GREY' ,'LIGHT_GREY'
        ,'DARK_NAVY' ,'RANDOM'].includes(color));
    }

    private getTemplateFields(x: string[]){
        let final;

        if (x[0].includes('\n')){
            const firstArg = x[0].split('\n');
            firstArg.shift();
            final = firstArg.concat(x.splice(1)).join(' ');
        }
        else {
            final = x.join(' ');
        }
        return final;
    }

    private buildEmbed(message: Message, template: TemplatedMessage,  editing?: string[]) {
        const title = template['title'];
        const description = template['description'];
        const color = template['color'];
        const footer = template['footer'];
        const thumbnail = template['thumbnail'];
        const image = template['image'];

        const embed = new RichEmbed();

        if (title){
            embed.setTitle(title)
        }
        if (description){
            embed.setDescription(description)
        }
        for (let i=1; i < 9; ++i){
            const field = template['field' + i];
            const value = template['value' + i];
            if (field && value){
                embed.addField(field, value);
            }
        }
        if (color){
            try{
                embed.setColor(color.replace(/[^[A-Z0-9a-z]]/, '').trim().toUpperCase());
            }
            catch (e) {
                throw new Error(IEmbedBuilderErrors.INVALID_COLOR);
            }
        }
        if (thumbnail){
            embed.setThumbnail(thumbnail);
        }
        if (image){
            embed.setImage(image);
        }

        if (footer){
            embed.setFooter(footer);
        }

        this.embeds[message.member.id] = template;

        return embed;
    }

    public embed(message: Message, input: [string]) {
        const x = message.content.split(' ');

        const final = this.getTemplateFields(x);


        const response: TemplatedMessage | string = templateParser(
            ['title', 'description', 'thumbnail', 'color', ...this.fields(), ...this.values(), 'image', 'footer'], final);
        if (typeof response === 'string'){
            return handleFailedCommand(
                message.channel, `**${response}** is not a valid placeholder for this command.`
            );
        }
        const embed: RichEmbed = this.buildEmbed(message, response);
        message.channel.send(embed);
        //const title = response['title'];
    }

    public async sendEmbed(message: Message){
        const prefix = await gb.instance.database.getPrefix(message.guild.id);
        const templatedMessage = this.embeds[message.member.id];

        if (!templatedMessage){
            return await handleFailedCommand(
                message.channel, `You haven't created an embed yet! use ${prefix}embed to build one!`
            );
        }

        const embed = this.buildEmbed(message, templatedMessage);
        safeSendMessage(message.channel, embed);
    }

    public async editEmbed(message: Message, ){
        const x = message.content.split(' ');

        const final = this.getTemplateFields(x);
        const existing = this.embeds[message.member.id];
        if (!existing){
            return handleFailedCommand(
                message.channel, `Hey you don't have an existing embed, make one with ${await gb.instance.database.getPrefix(message.guild.id)}embed`
            );
        }

        const response: TemplatedMessage | string = templateParser(
            ['title', 'description', 'thumbnail', 'color', ...this.fields(), ...this.values(), 'image', 'footer'], final);
        if (typeof response === 'string'){
            return handleFailedCommand(
                message.channel, `**${response}** is not a valid placeholder for this command.`
            );
        }

        for (let i in response){
            if (response[i]){
                existing[i] = response[i];
            }
        }
        const embed = this.buildEmbed(message, existing);
        safeSendMessage(message.channel, embed);
        return embed;
    }

}
