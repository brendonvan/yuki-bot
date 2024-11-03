const buttonHandlers = require("../components/buttons");

module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "sniffinspection") {
      // Log user ID from interaction
      console.log(
        `Calling startSniffInspection with user ID: ${interaction.user.id}`
      );

      // Defer the interaction response to prevent the warning
      await interaction.deferReply({ ephemeral: true });
      console.log("Interaction deferred successfully.");
      // Use interaction as the message context and pass user ID
      buttonHandlers.startSniffInspection(interaction, interaction.user.id);
    }
  }
};
