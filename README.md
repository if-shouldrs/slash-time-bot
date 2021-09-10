# SlashTime - Discord bot for generating timestamps

SlashTime is a bot that converts human-readable date/time strings into discord's unix-based timestamps which display differently based on the user's locale and local time, using discord's slash/application commands.

# Usage

First use `/timezone <tz>` to associate a timezone with your discord user. This is required since the bot has no idea what time it is on your machine, so it has to ask and memorize the timezone of each user.
"`<tz>`" is a TZ Database Timezone ([see here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)).
We use this instead of UTC offsets in order to support daylight savings and instead of timezones like "Pacific Standard Time" and "British Summer Time" because it's what `dayjs` (the library we use for handling dates) handles best.

To produce a timestamp, you use `/stamp <datetime> <format>`. The bot then replies to you privately with the discord timestamp string that matches what you inputted. Unfortunately, `<datetime>` always reads dates in the order `01/01/2021` as `mm/dd/yyyy` and changing that would require a lot of spaghetti code. If you're a sane person that likes typing days first, the best thing I can recommend is typing it `yyyy/mm/dd` which is the most accepted/unambiguous date format and is just the reverse of what you're used to. For `<format>`, it's a multiple choice selection with descriptive names for each option, including the letter that will be displayed in the discord timestamp. I only included 5/7 format options to reduce clutter and because the 2 remaining ones are duplicates with a bit more data. Since the bot simply replies to you the timestamp in private, you can just set one of the remaining 2 letters if you want.

The project is still in early stages so commands & names may still change.

# Setup Notes

To avoid issues when parsing certain date strings, please run the bot on a machine whose local time is UTC/GMT. Javascript's built in parser (and it seems higher level libraries as well) sometimes default to local time instead of UTC in an unpredictable fashion, so it's better to just make those the same for better compatibility.

The bot token should be in the file `config.json`. An example is provided in `config_template.json`.

# License

This repository is licensed under CC-BY-NC-2.5 (you can find an easy to follow explanation of an earlier version [here](<https://tldrlegal.com/license/creative-commons-attribution-noncommercial-(cc-nc)>)). The actual license is provided with the repository.
