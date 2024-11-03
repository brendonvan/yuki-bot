const { REST, Routes, ActivityType } = require("discord.js");

module.exports = async (client) => {
  const commands = [
    {
      name: "sniffinspection",
      description: "Start the sniff inspection",
    },
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(
      client.user.id,
      process.env.DISCORD_GUILD_ID
    ),
    { body: commands }
  );

  client.user.setActivity("Rocky III", { type: ActivityType.Watching });
};
