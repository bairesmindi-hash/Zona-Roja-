const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "verificar",
    alias: [],
    execute: async (client, message, args) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Zona Roja RP")
                .setDescription(
                    "🔒 **Verificación**\n\n" +
                    "Bienvenido al servidor.\n\n" +
                    "Para acceder al resto de los canales, presioná el botón de abajo.\n\n" +
                    "[✅ Verificarse]"
                )
                .setColor("#0099FF") // Color azul brillante como el de la foto
                .setFooter({ text: "Powered by Ticket King" });

            const fila = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('btn_verificacion')
                    .setLabel('Verificarse')
                    .setStyle(ButtonStyle.Success) // ButtonStyle.Success lo pone en color VERDE
                    .setEmoji('✅')
            );

            await message.channel.send({ embeds: [embed], components: [fila] });
            
        } catch (error) {
            console.log("Hubo un error al ejecutar el comando verificar:", error);
        }
    }
}
