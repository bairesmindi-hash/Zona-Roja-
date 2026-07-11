const { Client, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, EmbedBuilder, Events } = require('discord.js');
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
        
        // Lógica de apertura del formulario de postulación
        if (interaction.isButton() && interaction.customId === 'btn_postulacion') {
            const modal = new ModalBuilder().setCustomId('modal_postulacion').setTitle('Formulario de Postulación');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q1').setLabel('Nombre (OOC / IC)').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q2').setLabel('Edad').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q3').setLabel('Disponibilidad horaria').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q4').setLabel('¿Por qué querés ser Staff?').setStyle(TextInputStyle.Paragraph)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q5').setLabel('¿Qué conocimientos aportás?').setStyle(TextInputStyle.Paragraph))
            );
            return await interaction.showModal(modal);
        }

        // Lógica de recepción del formulario
        if (interaction.isModalSubmit() && interaction.customId === 'modal_postulacion') {
            const nombre = interaction.fields.getTextInputValue('q1');
            const edad = interaction.fields.getTextInputValue('q2');
            const disp = interaction.fields.getTextInputValue('q3');
            const razon = interaction.fields.getTextInputValue('q4');
            const cono = interaction.fields.getTextInputValue('q5');

            const channel = await interaction.guild.channels.create({
                name: `postu-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                ]
            });

            const embed = new EmbedBuilder()
                .setTitle('Nueva Postulación')
                .setColor(0xFF0000)
                .addFields(
                    { name: '👤 Nombre (OOC / IC)', value: nombre },
                    { name: '🎂 Edad', value: edad },
                    { name: '⏰ Disponibilidad', value: disp },
                    { name: '❓ ¿Por qué querés ser Staff?', value: razon },
                    { name: '💡 Conocimientos', value: cono }
                );

            await channel.send({ 
                content: `Hola ${interaction.user.toString()}, hemos recibido tu postulación. El staff la revisará en breve.`, 
                embeds: [embed] 
            });
            return await interaction.reply({ content: `✅ Postulación enviada al canal: ${channel}`, ephemeral: true });
        }
    } catch (e) { console.error(e); processing.delete(interaction.user.id); }
});

// Evento de bienvenida para Zona Roja RP
client.on(Events.GuildMemberAdd, (member) => {
    const welcomeEmbed = new EmbedBuilder()
        .setColor(0xFF0000) // Rojo
        .setTitle('¡Bienvenido a Zona Roja RP!')
        .setDescription(`¡Hola ${member.user.toString()}, estamos emocionados de tenerte acá! 💬`)
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: '👤 Usuario', value: member.user.username, inline: true },
            { name: '🆔 ID', value: member.id, inline: true },
            { name: '📅 Cuenta creada', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
        )
        .setFooter({ text: `¡Ahora somos ${member.guild.memberCount} miembros!` })
        .setTimestamp();

    const channel = member.guild.channels.cache.get('1520645046456680650');
    if (channel) channel.send({ embeds: [welcomeEmbed] });
});

client.login(process.env.TOKEN);
