import { expect } from "chai";
import * as automation from "./automation";
import * as superagent from "superagent";
import * as cheerio from "cheerio";

before(async () => {
  await automation.deploy();
});

after(async () => {
  await automation.destroy();
});

describe("Test infrastructure deployment", () => {
  it("should return correct html", async () => {
    await automation
      .getOuputs()
      .then((result) => result.url.value)
      .then((url) => {
        expect(url).to.be.a("string");
        return superagent.get(url);
      })
      .then((response) => response.text)
      .then((html) => {
        const $ = cheerio.load(html);
        expect($("title").text()).to.equal("Hello S3");
      });
  });

  it("should not return a 404", async () => {
    await automation
      .getOuputs()
      .then((result) => result.url.value)
      .then((url) => {
        expect(url).to.be.a("string");
        return superagent.get(url);
      })
      .then((response) => response.statusCode)
      .then((statusCode) => {
        expect(statusCode).to.equal(200);
      });
  })
});