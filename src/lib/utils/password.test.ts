import { saltAndHashPassword } from "./password.ts";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("saltAndHashPassword", () => {
  it("should return a string", async () => {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const result = await saltAndHashPassword(email!, password!);
    console.log("pass: ", result);
    assert.strictEqual(typeof result, "string");
  });
});
