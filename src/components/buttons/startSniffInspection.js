const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { getRandomEnding } = require("../../utils/siRandomizer");

// Role IDs for "stinky" and "not stinky" endings
const STINKY_ROLE_ID = process.env.STINKY_ROLE_ID;
const NOT_STINKY_ROLE_ID = process.env.NOT_STINKY_ROLE_ID;

// Set to track users who have already received the button
const activeInspections = new Set();

async function startSniffInspection(context, userId, deleteMessage = false) {
  console.log("Starting sniff inspection setup...");

  // Check if this user already has an active inspection
  if (activeInspections.has(userId)) {
    console.log(`User ${userId} already has an active sniff inspection.`);
    return; // Exit to prevent duplicate buttons
  }

  // Add userId to the active inspections Set
  activeInspections.add(userId);

  // Create the button row
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("start_sniff")
      .setLabel("Start sniff inspection")
      .setStyle(ButtonStyle.Primary)
  );
  console.log("Button row created.");

  try {
    let sentMessage;

    // Determine if `context` is an interaction or a message
    if (context.isCommand && context.isCommand()) {
      console.log("Context is an interaction; deferring reply...");
      sentMessage = await context.followUp({
        content: "Press the button to begin the sniff inspection.",
        components: [row],
      });
      console.log("Button sent as follow-up to interaction.");
    } else if (context.channel && context.channel.send) {
      console.log("Context is a message; sending button in the channel...");
      sentMessage = await context.channel.send({
        content: "Press the button to begin the sniff inspection.",
        components: [row],
      });
      console.log("Button sent as message in channel:", sentMessage.id);
    } else {
      throw new Error("Unknown context type. Expected interaction or message.");
    }

    // Set up the collector to listen for button clicks
    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (i) => i.user.id === userId,
    });
    console.log("Collector created and now listening for interactions.");

    // Handle button interactions as usual
    collector.on("collect", async (interaction) => {
      console.log("Button interaction received...");
      if (interaction.customId === "start_sniff") {
        console.log(
          "The sniff inspection button was pressed by the user with ID:",
          interaction.user.id
        );

        // Immediately defer the interaction to prevent it from timing out
        await interaction.deferUpdate();
        console.log("Interaction deferred successfully.");

        // Generate random ending
        const { sniff, ending, isStinky } = getRandomEnding();
        console.log("Random ending generated:", sniff, ending);

        await interaction.followUp({ content: sniff, ephemeral: true });
        console.log("First follow-up message sent.");

        // Assign the appropriate role based on the ending type
        const guildMember = await interaction.guild.members.fetch(userId);
        const roleToAdd = isStinky ? STINKY_ROLE_ID : NOT_STINKY_ROLE_ID;
        const roleToRemove = isStinky ? NOT_STINKY_ROLE_ID : STINKY_ROLE_ID;

        try {
          // Remove the opposite role if the user has it
          if (guildMember.roles.cache.has(roleToRemove)) {
            await guildMember.roles.remove(roleToRemove);
            console.log(`Removed role ${roleToRemove} from user ${userId}.`);
          }

          // Add the appropriate role
          await guildMember.roles.add(roleToAdd);
          console.log(
            `Assigned role ${roleToAdd} (${
              isStinky ? "stinky" : "not stinky"
            }) to user ${userId}.`
          );
        } catch (error) {
          console.error(`Failed to manage roles for user ${userId}:`, error);
        }

        // Additional follow-ups
        setTimeout(async () => {
          await interaction.followUp({
            content: "Interesting...",
            ephemeral: true,
          });
          console.log("Second follow-up message sent.");
        }, 4000);

        setTimeout(async () => {
          await interaction.followUp({ content: ending[0], ephemeral: true });
          console.log("Third follow-up message sent.");
        }, 8000);

        setTimeout(async () => {
          await interaction.followUp({ content: ending[1], ephemeral: true });
          console.log("Fourth follow-up message sent.");
        }, 12000);

        collector.stop();
      }
    });

    collector.on("end", async (collected) => {
      console.log(`Collector ended. Collected ${collected.size} interactions.`);
      activeInspections.delete(userId);

      // Conditionally delete the button message if `deleteMessage` is true
      if (deleteMessage) {
        try {
          await sentMessage.delete();
          console.log("Button message deleted after interaction.");
        } catch (error) {
          console.error("Failed to delete button message:", error);
        }
      }
    });
  } catch (error) {
    console.error("Error in startSniffInspection:", error);
    activeInspections.delete(userId);
  }
}

module.exports = { startSniffInspection };
