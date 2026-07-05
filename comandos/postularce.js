const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'postularce',
    description: 'Envía el botón para postularse',
    async execute(client, message, args) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('btn_postulacion')
                    .setLabel('Postularse')
                    .setStyle(ButtonStyle.Primary),
            );

        await message.reply({ 
            content: '¡Haz clic en el botón de abajo para iniciar tu postulación!', 
            components: [row] 
        });
    }
};
