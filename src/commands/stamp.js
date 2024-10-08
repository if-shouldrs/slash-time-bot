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

// Returns dayjs date with added support of time strings only, using current day
function parseDate(dateTime, tz) {
    // If dayjs can't find a date in the given string
    if (!dayjs(dateTime).isValid()) {
        // Get current date, append string to the end, and try again
        const currentDate = dayjs().format("YYYY/MM/DD");
        // Return null if dateTime is still invalid
        if (!dayjs(`${currentDate} ${dateTime}`).isValid()) {
            return null;
        }
        // Parse for the 3rd time (sucks for performance but best for dev time)
        return dayjs.tz(`${currentDate} ${dateTime}`, tz);
    }
    // Discard previous parsing and parse again using timezone (avoids exception)
    return dayjs.tz(dateTime, tz);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stamp")
        .setDescription("Convert date/time string to discord unix timestamp.")
        .addStringOption((option) =>
            option
                .setName("date-time")
                .setDescription("Your date-time string.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("format")
                .setDescription("Format to use when presenting the timestamp.")
                .addChoice("standard (f)", "f")
                .addChoice("short date (d)", "d")
                .addChoice("time (t)", "t")
                .addChoice("remaining (R)", "R")
                .addChoice("written date (D)", "D"),
        ),
    async execute(interaction) {
        // Make message permanent (and "globally" visible) if sent in a DM
        const ephemeral = interaction.guildId !== null;
        const dateStr = interaction.options.getString("date-time");
        let format = interaction.options.getString("format");
        if (format === null) {
            format = "f";
        }

        // eslint-disable-next-line func-names
        db.get(interaction.user.id, function (err, tz) {
            if (err) {
                if (err.notFound) {
                    // Return since user hasn't set a timezone yet
                    const response = "Please set your timezone first!";
                    interaction.reply({ content: response, ephemeral });
                    return;
                }
                // I/O or other error, pass it up the callback chain
                console.log("### ERROR GETTING TIMEZONE FROM DB ###");
                console.log(err);
                const response =
                    "Something went wrong fetching your timezone data.";
                interaction.reply({ content: response, ephemeral });
                return;
            }

            // Fetch and return timestamp based on user's timezone
            const dayjsDateTime = parseDate(dateStr, tz);
            if (dayjsDateTime === null) {
                // Handle invalid dateTime entries
                const response =
                    "The date/time you inserted is not in a valid format.";
                interaction.reply({ content: response, ephemeral });
                return;
            }

            // Generate discord timestamp reply
            const unix = dayjsDateTime.unix();
            const stamp = `<t:${unix}:${format}>`;
            const response = `${stamp}\n\`${stamp}\``;
            interaction.reply({ content: response, ephemeral });
        });
    },
};
