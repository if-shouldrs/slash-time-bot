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

// Returns dayjs date with added support of time strings only, using current day
function parseDate(dateTime) {
    let ret = dayjs(dateTime);
    if (Number.isNaN(ret.$D)) {
        const currentDate = dayjs().format("YYYY/MM/DD");
        ret = dayjs(`${currentDate} ${dateTime}`);
    }
    return ret;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stamp")
        .setDescription("Convert date string to discord unix timestamp.")
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
                .addChoice("standard", "f")
                .addChoice("short date", "d")
                .addChoice("time", "t")
                .addChoice("remaining", "R")
                .addChoice("written date", "D"),
        ),
    async execute(interaction) {
        const dateStr = interaction.options.getString("date-time");
        let format = interaction.options.getString("format");
        if (format === null) {
            format = "f";
        }

        // eslint-disable-next-line func-names
        db.get(interaction.user.id, function (err, value) {
            if (err) {
                if (err.notFound) {
                    // Return since user hasn't set a timezone yet
                    const response = "Please set your timezone first!";
                    interaction.reply({ content: response, ephemeral: true });
                    return;
                }
                // I/O or other error, pass it up the callback chain
                console.log("### ERROR GETTING TIMEZONE FROM DB ###");
                console.log(err);
                const response =
                    "Something went wrong fetching your timezone data.";
                interaction.reply({ content: response, ephemeral: true });
                return;
            }

            // Fetch and return timestamp based on user's timezone
            const unix = parseDate(dateStr).tz(value).unix();
            const stamp = `<t:${unix}:${format}>`;
            const response = `${stamp}\n\`${stamp}\``;
            interaction.reply({ content: response, ephemeral: true });
        });
    },
};
