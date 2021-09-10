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
                .setDescription("The TZ Database name for your timezone"),
        ),
    async execute(interaction) {
        const tz = interaction.options.getString("tz");
        if (tz === null) {
            // eslint-disable-next-line func-names
            db.get(interaction.user.id, function (err, tz) {
                let response;
                if (err) {
                    // No timezone given and no timezone in db, help user find one
                    response =
                        "Please set your timezone to a valid tz code (see here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)";
                } else {
                    // No timezone given, inform user of current timezone
                    response = `Your current timezone is \`${tz}\`.`;
                }
                interaction.reply({ content: response, ephemeral: true });
            });
            return;
        }

        // Update user's timezone in db
        await db.put(interaction.user.id, tz);

        // Inform user of successful change
        const response = `Timezone successfully set to \`${tz}\`.`;
        await interaction.reply({ content: response, ephemeral: true });
    },
};
