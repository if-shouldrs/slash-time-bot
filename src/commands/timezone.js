const { SlashCommandBuilder } = require("@discordjs/builders");

// DayJS imports
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
// Enable timezone plugin
dayjs.extend(utc);
dayjs.extend(timezone);

// DB access imports
const { db } = require("../db/db-access");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timezone")
        .setDescription("Set or check your timezone.")
        .addStringOption((option) =>
            option
                .setName("tz")
                .setDescription("The TZ Database name for your timezone")
                .setRequired(false),
        ),
    async execute(interaction) {
        // Make message permanent (and "globally" visible) if sent in a DM
        const ephemeral = interaction.guildId !== null;
        const tz = interaction.options.getString("tz");
        if (tz === null) {
            // eslint-disable-next-line func-names
            db.get(interaction.user.id, function (err, tzCode) {
                let response;
                if (err) {
                    // No timezone given and no timezone in db, help user find one
                    response =
                        "Please set your timezone to a valid tz code (see here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)";
                } else {
                    // No timezone given, inform user of current timezone
                    response = `Your current timezone is \`${tzCode}\`.`;
                }
                interaction.reply({ content: response, ephemeral });
            });
            return;
        }

        // Validate timezone
        try {
            dayjs().tz(tz);
        } catch (error) {
            const response =
                "Invalid timezone used. Please use a valid tz code (see here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)";
            await interaction.reply({ content: response, ephemeral });
            return;
        }

        // Update user's timezone in db
        await db.put(interaction.user.id, tz);

        // Inform user of successful change
        const response = `Timezone successfully set to \`${tz}\`.`;
        await interaction.reply({ content: response, ephemeral });
    },
};
