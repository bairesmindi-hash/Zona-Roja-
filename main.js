const { Client, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
const processing = new Set(); 

// Carga de comandos
const comandosPath = './comandos';
if (fs.existsSync(comandosPath)) {
    const commandFiles = fs.readdirSync(comandosPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles) {
        try {
            const cmd = require(`./comandos/${file}`);
            if (cmd.name) client.commands.set(cmd.name, cmd);
        } catch (e) { console.error(`Error en ${file}:`, e); }
    }
}

client.once('ready', () => console.log(`🚀 BOT ONLINE: ${client.user.tag}`));

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
            await channel.send(`¡Hola <@${interaction.user.id}>! Ticket de **${ticketType}** creado.`);
            return await interaction.reply({ content: `✅ Creado: ${channel}`, ephemeral: true });
        }
        // Lógica de postulación simplificada para evitar errores
        if (interaction.isButton() && interaction.customId === 'btn_postulacion') {
            const modal = new ModalBuilder().setCustomId('modal_postulacion').setTitle('Postulación');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q1').setLabel('Edad').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q2').setLabel('Usuario').setStyle(TextInputStyle.Short))
            );
            return await interaction.showModal(modal);
        }
    } catch (e) { console.error(e); processing.delete(interaction.user.id); }
});

client.login(process.env.TOKEN);
