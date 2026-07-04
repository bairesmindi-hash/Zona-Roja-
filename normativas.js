const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "normativas",
    alias: ["normativa", "reglas"],
    execute: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setTitle("📜 REGLAMENTO OFICIAL | ZONA ROJA RP")
            .setDescription("Bienvenido a **Zona Roja RP**. El desconocimiento de estas normas no exime de su cumplimiento. Por favor, lee con atención para asegurar una convivencia justa y de alta calidad.")
            .setColor("#E74C3C")
            .setThumbnail(client.user.displayAvatarURL()) // Pone la foto de perfil de tu bot
            .addFields(
                { name: "⚖️ 1. Normativa General", value: "• **IC:** Todo lo del juego.\n• **OOC:** Todo lo fuera del juego (no mezclar).\n• **PG:** No realices acciones físicamente imposibles.\n• **MG:** Prohibido usar información externa.\n• **DM/VDM:** No ataques sin rol previo o atropelles intencionadamente." },
                { name: "🎥 2. Streamers & Contenido", value: "• **Stream Snipe:** Baneo permanente directo.\n• **Toxicidad:** No insultar ni denigrar a otros frente a tu audiencia.\n• **Privacidad:** No transmitir chats administrativos sin permiso." },
                { name: "💎 3. Donaciones & VIP", value: "• **Voluntarias:** Ayudan al mantenimiento del servidor.\n• **Sin Reembolso:** Las donaciones no son retornables.\n• **Igualdad:** Ser VIP no te exime de cumplir el reglamento." },
                { name: "👮 4. Facciones (Legales/Ilegales)", value: "• **Corrupción:** Requiere rol aprobado por el Staff.\n• **Límites:** Respetar el máximo de miembros en escenas.\n• **Material:** No robar vehículos de facción para trolear." }
            )
            .setFooter({ text: "Zona Roja RP - La calidad del rol la hacemos entre todos." })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
}