export const Config = {
    DEFAULT_PREFIX: "-",
    DEV_MODE: process.env.NODE_ENV !== "production",
    EVENTS: {
        DISCORD_EVENTS: `${__dirname}/src/Events/Discord`,
        DATABASE_EVENTS: `${__dirname}/src/Events/Database`
    }
};
