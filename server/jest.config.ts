import type { Config } from "jest";

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["./**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"]
};

export default config;
