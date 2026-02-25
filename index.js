require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const command = new SlashCommandBuilder()
  .setName("msg")
  .setDescription("Envia uma mensagem como bot")
  .addStringOption(option =>
    option.setName("texto")
      .setDescription("Mensagem para enviar")
      .setRequired(true)
  );

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: [command.toJSON()] }
  );

  console.log("✅ Comando registrado");
}

client.once("ready", async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  await registerCommands();
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "msg") return;

  const texto = interaction.options.getString("texto");

  await interaction.reply({ content: "✅ Mensagem enviada!", ephemeral: true });
  await interaction.channel.send(texto);
});

client.login(process.env.DISCORD_TOKEN);
