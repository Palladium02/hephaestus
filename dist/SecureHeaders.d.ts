declare type CrossOrigin = {
    "Cross-Origin-Embedder-Policy"?: "unsafe-none" | "require-corp";
    "Cross-Origin-Opener-Policy"?: "unsafe-none" | "same-origin" | "same-origin-allow-popups";
    "Cross-Origin-Resource-Policy"?: "same-site" | "same-origin" | "cross-origin";
};
declare type ExpectCT = {
    "report-uri"?: string;
    enforce: boolean | null;
    "max-age": number;
};
declare type ReferrerPolicy = "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
declare type StrictTransfer = {
    "max-age": number;
    includeSubDomains?: boolean;
    preload?: boolean;
};
declare type XContentTypeOptions = boolean;
declare type XDNSPrefetchControl = "on" | "off";
declare type XFrameOptions = "DENY" | "SAMEORIGIN";
declare type XXSSProtection = {
    enable: boolean;
    mode?: "block";
    report?: string;
};
declare class SecureHeaders {
    private _headers;
    crossOrigin(options: CrossOrigin): this;
    expectCT(options: ExpectCT): this;
    referrerPolicy(option: ReferrerPolicy): this;
    strictTransfer(options: StrictTransfer): this;
    noSniff(option: XContentTypeOptions): this;
    dnsPrefetch(option: XDNSPrefetchControl): this;
    xFrame(option: XFrameOptions): this;
    XSSProtection(options: XXSSProtection): this;
    getHeaders(): {
        [key: string]: any;
    };
    private _mapObject;
}
declare const SecurityHeaders: SecureHeaders;
export { SecurityHeaders };
