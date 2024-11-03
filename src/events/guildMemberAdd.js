const buttonHandlers = require("../components/buttons");

module.exports = async (client) => {
  console.log("Listening for specific welcome messages...");

  client.on("messageCreate", async (message) => {
    console.log("New message detected in channel:", message.channel.id);

    // Check if the message is in the welcome channel
    if (message.channel.id === process.env.WELCOME_CHANNEL_ID) {
      console.log(
        "Message is in the welcome channel:",
        message.channel.id,
        process.env.WELCOME_CHANNEL_ID
      );

      // Regex pattern to match "Hey <@USERID>, welcome to **VIRGINS ONLY**!"
      const welcomePattern = /^Hey <@(\d+)>, welcome to \*\*VIRGINS ONLY\*\*!$/;

      // Match the message content to the pattern
      const match = message.content.match(welcomePattern);
      console.log("Matching message content:", match);

      if (match) {
        const memberId = match[1]; // Extract member ID from the message
        console.log("Extracted member ID from welcome message:", memberId);

        // Fetch the member using the extracted ID
        const member = await message.guild.members
          .fetch(memberId)
          .catch(console.error);

        if (member) {
          console.log("Member found with ID:", member.id);

          // Trigger the startSniffInspection function with the detected message and member ID
          console.log(
            `Calling startSniffInspection with user ID: ${member.id}`
          );

          // Pass `message` as the context since this is a non-interaction event
          buttonHandlers.startSniffInspection(message, member.id, true);
        } else {
          console.error("Member not found or accessible.");
        }
      } else {
        console.log("Message content does not match welcome pattern.");
      }
    } else {
      console.log("Message is not in the welcome channel. Ignoring...");
    }
  });
};
