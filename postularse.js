const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "postularse",
    alias: [],
    execute: async (client, message, args) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Help & Support")
                .setDescription(
                    "¿Querés formar parte del equipo de administración y ayudar a que nuestra comunidad crezca?\n\n" +
                    "Estamos en búsqueda de personas responsables, activas y con ganas de aportar positivamente al servidor.\n\n" +
                    "Completá el formulario y nos pondremos en contacto si tu perfil es el adecuado."
                )
                .setColor("#FF0000") // Color rojo como la barra de tu foto
                .setFooter({ text: "Powered by Ticket King" });

            const fila = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('btn_postulacion')
                    .setLabel('Postulacion')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📝')
            );

            await message.channel.send({ embeds: [embed], components: [fila] });
            
        } catch (error) {
            console.log("Hubo un error al ejecutar el comando postularse:", error);
        }
    }
}