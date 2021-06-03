class Util {
    static hideProp(src: any, target: string) {
        Object.defineProperty(src, target, { writable: true, configurable: true, enumerable: false });
    }

    static safeRequire(mod: string) {
        try {
            delete require.cache[require.resolve(mod)];
            
            return require(mod);
        } catch {
            return null;
        }
    }
}

export { Util };
