export const Config = {
    DEFAULT_PREFIX: "-",
    DEVELOPERS: ["480933736276426763"],
    DEV_MODE: process.env.NODE_ENV !== "production",
    EVENTS: {
        DISCORD_EVENTS: `${__dirname}/src/Events/Discord`,
        DATABASE_EVENTS: `${__dirname}/src/Events/Database`
    },
    COMMANDS_DIR: `${__dirname}/src/Commands`,
    WEB_SERVER: {
        PORT: process.env.PORT ?? 3000
    }
};
