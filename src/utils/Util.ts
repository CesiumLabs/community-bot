class Util {
    static hideProp(src: any, target: string) {
        Object.defineProperty(src, target, { writable: true, configurable: true, enumerable: false });
    }
}

export { Util };
