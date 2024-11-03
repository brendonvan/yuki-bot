const { Client, IntentsBitField } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const guildMemberAdd = require("./events/guildMemberAdd");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Dynamically load events
fs.readdirSync("./src/events").forEach((file) => {
  const event = require(`./events/${file}`);
  const eventName = file.split(".")[0];
  client.on(eventName, event.bind(null, client));
});

client.on("guildMemberAdd", (member) => guildMemberAdd(client, member));

client.login(process.env.TOKEN);
