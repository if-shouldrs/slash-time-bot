const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testme")
        .setDescription("Test command for testing options.")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("Your message")
                .setRequired(true),
        ),
    async execute(interaction) {
        console.log(interaction.options.getString("message"));
        await interaction.reply("Tested!");
    },
};
