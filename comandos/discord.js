const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'ticket', 
    async execute(client, message, args) {
        
        const panelEmbed = new EmbedBuilder()
            .setTitle('Sunsel Scrips Comuniti')
            .setDescription('📧 ¿Necesitás algún servicio o tenés alguna consulta?\n\nAbrí un **ticket** y nuestro equipo te responderá lo antes posible para ayudarte. ¡Estamos a tu disposición! 🚀')
            .setColor('#F1C40F')
            .setFooter({ text: 'Powered by Ticket King' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('t_dudas')
                    .setLabel('Dudas')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('❓'),
                new ButtonBuilder()
                    .setCustomId('t_compra')
                    .setLabel('Compra')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('💳')
            );

        await message.channel.send({ embeds: [panelEmbed], components: [row] });
    }
};
