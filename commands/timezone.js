const { SlashCommandBuilder } = require("@discordjs/builders");

// DayJS imports
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
// Enable timezone plugin
dayjs.extend(utc);
dayjs.extend(timezone);

// DB access imports
const { db } = require("../db/dbaccess");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timezone")
        .setDescription("Set your timezone.")
        .addStringOption((option) =>
            option
                .setName("tz")
                .setDescription("The TZ Database name for your timezone")
                .setRequired(true),
        ),
    async execute(interaction) {
        const tz = interaction.options.getString("tz");

        console.log(`adjusting user's timezone to ${tz}`);
        await db.put(interaction.user.id, tz);

        const stamp = `<t:${dayjs().tz(tz).unix()}:f>`;
        const response = `Timezone successfully set to \`${tz}\`\n${stamp}\n\`${stamp}\``;
        await interaction.reply({ content: response, ephemeral: true });
    },
};
