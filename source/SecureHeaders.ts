type CrossOrigin = {
  "Cross-Origin-Embedder-Policy"?: "unsafe-none" | "require-corp";
  "Cross-Origin-Opener-Policy"?:
    | "unsafe-none"
    | "same-origin"
    | "same-origin-allow-popups";
  "Cross-Origin-Resource-Policy"?: "same-site" | "same-origin" | "cross-origin";
};

type ExpectCT = {
  "report-uri"?: string;
  enforce: boolean | null;
  "max-age": number;
};

type ReferrerPolicy =
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

type StrictTransfer = {
  "max-age": number;
  includeSubDomains?: boolean;
  preload?: boolean;
};

type XContentTypeOptions = boolean;

type XDNSPrefetchControl = "on" | "off";

type XFrameOptions = "DENY" | "SAMEORIGIN";

type XXSSProtection = {
  enable: boolean;
  mode?: "block";
  report?: string;
};

type OptionFlags<T> = unknown & (keyof T)[];

class SecureHeaders {
  private _headers: { [key: string]: any } = {};
  public crossOrigin(options: CrossOrigin) {
    this._mapObject(options);
    return this;
  }
  public expectCT(options: ExpectCT) {
    let keys = Object.keys(options) as OptionFlags<ExpectCT>;
    let header: string[] = [];
    keys.forEach((key) => {
      if (key !== "report-uri") {
        header.push(key);
        return;
      }
      header.push(`${key}=${options[key]}`);
    });
    this._headers["Expect-CT"] = header.join(",");
    return this;
  }
  public referrerPolicy(option: ReferrerPolicy) {
    this._headers["Referrer-Policy"] = option;
    return this;
  }
  public strictTransfer(options: StrictTransfer) {
    let keys = Object.keys(options) as OptionFlags<StrictTransfer>;
    let headers: string[] = [];
    keys.forEach((key) => {
      let value = options[key];
      switch (key) {
        case "includeSubDomains":
          if (value) {
            headers.push(key);
          }
          break;
        case "max-age":
          headers.push(`${key}=${options[key]}`);
          break;
        case "preload":
          if (value) {
            headers.push(key);
            break;
          }
      }
    });
    this._headers["Strict-Transport-Security"] = headers.join(";");
    return this;
  }
  public noSniff(option: XContentTypeOptions) {
    if (option) {
      this._headers["X-Content-Type-Options"] = "nosniff";
    }
    return this;
  }
  public dnsPrefetch(option: XDNSPrefetchControl) {
    this._headers["X-DNS-Prefetch-Control"] = option;
    return this;
  }
  public xFrame(option: XFrameOptions) {
    this._headers["X-Frame-Options"] = option;
    return this;
  }
  public XSSProtection(options: XXSSProtection) {
    if (!options.enable) {
      this._headers["X-XSS-Protection"] = "0";
      return this;
    }
    let keys = Object.keys(options) as OptionFlags<XXSSProtection>;
    let headers = [];
    keys.forEach((key) => {
      if (key === "enable") {
        headers.push(1);
        return;
      }
      headers.push(`${key}=${options[key]}`);
      return;
    });
    return this;
  }

  public getHeaders() {
    return this._headers;
  }

  private _mapObject<T>(options: T) {
    let keys = Object.keys(options) as OptionFlags<T>;
    keys.forEach((key) => {
      this._headers[key as string] = options[key];
    });
  }
}

const SecurityHeaders = new SecureHeaders();
export { SecurityHeaders };
