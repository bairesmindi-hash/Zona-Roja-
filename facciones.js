const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "facciones",
    alias: [],
    execute: async (client, message, args) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Discord de Facciones")
                .setDescription("¡No te pierdas nada de lo que sucede en el Discord de Facciones! Únete tocando el botón de abajo.")
                .setColor("#FEE75C");

            const fila = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Unirse al Discord')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/MH4JAkF68D')
            );

            await message.channel.send({ embeds: [embed], components: [fila] });
        } catch (error) {
            console.error(error);
        }
    }
};