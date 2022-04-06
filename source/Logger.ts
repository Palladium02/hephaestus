import fs from "fs";
import path from "path";

const date = () => {
  let now = new Date();
  return `${prefix(now.getDate())}/${prefix(now.getMonth() + 1)}/${prefix(
    now.getFullYear()
  )}, ${prefix(now.getHours())}:${prefix(now.getMinutes())}:${prefix(
    now.getSeconds()
  )}`;
};

const prefix = (n: number) => {
  return n < 10 ? `0${n}` : n.toString();
};

class Log {
  private _stdout: "stdout" | "file" = "stdout";
  private _location: string = path.join(__dirname, "..", "..");
  private _time: string = new Date()
    .toUTCString()
    .replace(/\s/gm, "")
    .replace(/(\,|\:)/gm, "");

  constructor() {}

  log(message: string) {
    if (this._stdout === "stdout") {
      console.log(`[${date()}] - ${message}`);
    }

    if (this._location) {
      if (fs.existsSync(path.join(this._location, `${this._time}.txt`))) {
        let content = fs.readFileSync(
          path.join(this._location, `${this._time}.txt`),
          { encoding: "utf-8" }
        );
        content += `\n[${date()}] - ${message}`;
        fs.writeFileSync(
          path.join(this._location, `${this._time}.txt`),
          content,
          { encoding: "utf-8" }
        );
      } else {
        let content = `[${date()}] - This is the first log entry.\n[${date()}] - ${message}`;
        fs.writeFileSync(
          path.join(this._location, `${this._time}.txt`),
          content,
          { encoding: "utf-8", flag: "w+" }
        );
      }
    }
  }

  changeStdOut(path: string) {
    this._stdout = "file";
    this._location = path;
  }
}

const Logger = new Log();
export { Logger };
