declare const parseQuerystring: (url: string) => {
    _url: string;
    query: {
        [key: string]: string;
    };
};
export { parseQuerystring };
