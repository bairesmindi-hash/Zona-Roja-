const { Client, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
const fs = require('fs');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
});

client.commands = new Collection();
const processing = new Set(); 

const comandosPath = './comandos';
if (fs.existsSync(comandosPath)) {
    const commandFiles = fs.readdirSync(comandosPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles) {
        try {
            const command = require(`./comandos/${file}`);
            client.commands.set(command.name, command);
        } catch (e) { console.error(e); }
    }
}

client.once('ready', () => {
    console.log(`🚀 BOT ENCENDIDO: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith("u/") || message.author.bot) return;
    const args = message.content.slice(2).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();
    const cmd = client.commands.get(cmdName);
    if (cmd) try { await cmd.execute(client, message, args); } catch (e) { console.error(e); }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    if (processing.has(interaction.user.id)) return;
    processing.add(interaction.user.id);
    setTimeout(() => processing.delete(interaction.user.id), 3000);

    try {
        // --- LÓGICA DE TICKETS ---
        if (interaction.isButton() && interaction.customId.startsWith('t_')) {
            const ticketType = interaction.customId.replace('t_', '');
            const channel = await interaction.guild.channels.create({
                name: `ticket-${ticketType}-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                ]
            });
            await channel.send(`¡Hola <@${interaction.user.id}>! Hemos recibido tu ticket de **${ticketType}**. En breve un miembro del staff se pondrá en contacto contigo para ayudarte.`);
            return await interaction.reply({ content: `✅ Ticket de **${ticketType}** creado: ${channel}`, ephemeral: true });
        }

        // --- LÓGICA DE POSTULACIONES ---
        if (interaction.isButton() && interaction.customId === 'btn_postulacion') {
            const modal = new ModalBuilder().setCustomId('modal_postulacion').setTitle('Formulario de Postulación');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q1').setLabel('Edad').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q2').setLabel('Usuario').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q3').setLabel('Experiencia').setStyle(TextInputStyle.Paragraph)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q4').setLabel('Tiempo').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q5').setLabel('Motivo').setStyle(TextInputStyle.Paragraph))
            );
            return await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === 'modal_postulacion') {
            await interaction.deferReply({ ephemeral: true });
            const nombreCanal = `postulacion-${interaction.user.username}`;
            const canalExistente = interaction.guild.channels.cache.find(c => c.name === nombreCanal);
            
            if (canalExistente) return interaction.editReply({ content: `❌ Ya tienes una postulación abierta: ${canalExistente}` });

            const channel = await interaction.guild.channels.create({ 
                name: nombreCanal, 
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                ]
            });
            
            await channel.send(`¡Hola <@${interaction.user.id}>! Hemos recibido tu postulación correctamente. En breve nos pondremos en contacto contigo.\n\n**Datos enviados:**\nEdad: ${interaction.fields.getTextInputValue('q1')}\nUsuario: ${interaction.fields.getTextInputValue('q2')}\nExperiencia: ${interaction.fields.getTextInputValue('q3')}\nTiempo disponible: ${interaction.fields.getTextInputValue('q4')}\nMotivo: ${interaction.fields.getTextInputValue('q5')}`);
            
            await interaction.editReply({ content: `✅ Postulación enviada: ${channel}` });
        }
    } catch (e) { 
        console.error("Error:", e); 
        processing.delete(interaction.user.id);
    }
});

client.login(process.env.TOKEN);
