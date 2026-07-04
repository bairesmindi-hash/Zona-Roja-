const { Client, GatewayIntentBits, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
});

client.commands = new Collection();
const TOKEN = ""; 
const ROL_CIVILES_ID = ""; 

// --- CARGA DE COMANDOS ---
try {
    const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));
    for(const file of commandFiles) {
        const command = require(`./comandos/${file}`);
        client.commands.set(command.name, command);
        console.log(`✅ Comando cargado: ${file}`);
    }
} catch (e) { console.log("⚠️ Carpeta 'comandos' no encontrada o vacía."); }

// --- EVENTO DE INICIO ---
client.once('ready', () => {
    console.log(`🚀 BOT ENCENDIDO Y CONECTADO: ${client.user.tag}`);
});

// --- LÓGICA DE COMANDOS (u/...) ---
client.on('messageCreate', async message => {
    if (!message.content.startsWith("u/") || message.author.bot) return;
    const args = message.content.slice(2).trim().split(/ +/g);
    const cmd = client.commands.get(args.shift().toLowerCase());
    if (cmd) try { await cmd.execute(client, message, args); } catch (e) { console.error(e); }
});

// --- LÓGICA DE BOTONES Y FORMULARIOS ---
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'btn_verificacion') {
            const role = interaction.guild.roles.cache.get(ROL_CIVILES_ID);
            try { await interaction.member.roles.add(role); await interaction.reply({ content: "✅ Verificado.", ephemeral: true }); } 
            catch (e) { await interaction.reply({ content: "Error: No tengo permisos.", ephemeral: true }); }
        }
        else if (interaction.customId === 'btn_postulacion') {
            const modal = new ModalBuilder().setCustomId('modal_postulacion').setTitle('Formulario de Postulación');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q1').setLabel('Edad').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q2').setLabel('Nombre y Usuario').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q3').setLabel('Experiencia').setStyle(TextInputStyle.Paragraph)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q4').setLabel('Tiempo').setStyle(TextInputStyle.Short)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q5').setLabel('Motivo').setStyle(TextInputStyle.Paragraph))
            );
            await interaction.showModal(modal);
        }
    }
    else if (interaction.isModalSubmit() && interaction.customId === 'modal_postulacion') {
        const r = [interaction.fields.getTextInputValue('q1'), interaction.fields.getTextInputValue('q2'), interaction.fields.getTextInputValue('q3'), interaction.fields.getTextInputValue('q4'), interaction.fields.getTextInputValue('q5')];
        const channel = await interaction.guild.channels.create({ name: `postulacion-${interaction.user.username}`, type: ChannelType.GuildText });
        await interaction.reply({ content: `Postulación enviada: ${channel}`, ephemeral: true });
        await channel.send(`**Nueva Postulación:**\nEdad: ${r[0]}\nUsuario: ${r[1]}\nExp: ${r[2]}\nTiempo: ${r[3]}\nMotivo: ${r[4]}`);
    }
});

client.login("");