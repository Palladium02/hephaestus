import { Logger } from "../Logger";

export const Expections: [string, (data: any) => void][] = [
  [
    "Exceptions.routes.malformed",
    (data) => {
      Logger.log(
        `Malformed route (${data?.route}) was being tried to be registered and therefore ignored.`
      );
    },
  ],
];
