const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "soporte",
    alias: [],
    execute: async (client, message, args) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Help & Support")
                .setDescription("Haz clic acá para crear un nuevo ticket de soporte 🎟️")
                .setColor("#FEE75C")
                .setFooter({ text: "Powered by Ticket King" });

            // Fila 1 (5 botones de la foto)
            const fila1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('t_reportes').setLabel('Reportes').setStyle(ButtonStyle.Secondary).setEmoji('🎟️'),
                new ButtonBuilder().setCustomId('t_apelar').setLabel('Apelar Ban').setStyle(ButtonStyle.Secondary).setEmoji('🚫'),
                new ButtonBuilder().setCustomId('t_compras').setLabel('Compras').setStyle(ButtonStyle.Secondary).setEmoji('💳'),
                new ButtonBuilder().setCustomId('t_bugs').setLabel('Reporte Bugs').setStyle(ButtonStyle.Secondary).setEmoji('🐛'),
                new ButtonBuilder().setCustomId('t_streamers').setLabel('Streamers').setStyle(ButtonStyle.Secondary).setEmoji('💬')
            );

            // Fila 2 (3 botones de la foto)
            const fila2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('t_staff').setLabel('Reportar Staff').setStyle(ButtonStyle.Secondary).setEmoji('💫'),
                new ButtonBuilder().setCustomId('t_ss').setLabel('Solicitar SS').setStyle(ButtonStyle.Secondary).setEmoji('📺'),
                new ButtonBuilder().setCustomId('t_dudas').setLabel('Dudas').setStyle(ButtonStyle.Secondary).setEmoji('🙇')
            );

            await message.channel.send({ embeds: [embed], components: [fila1, fila2] });
            
        } catch (error) {
            console.log("Hubo un error al ejecutar el comando soporte:", error);
        }
    }
}