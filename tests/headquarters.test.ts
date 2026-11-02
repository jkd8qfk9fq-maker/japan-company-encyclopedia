import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { placeAddress, readMunicipalities } from "../scripts/pipeline/sync-headquarters.mjs";
import map from "@/assets/japan/prefectures.json";
import headquarters from "@/data/headquarters.json";
import { companies } from "@/data/companies";
import { PREFECTURES } from "@/lib/prefectures";

const municipalities = readMunicipalities(join(process.cwd(), "pipeline/municipalities.tsv"));
const place = (address: string) => placeAddress(address, municipalities);

describe("placing an EDINET 所在地 in a prefecture", () => {
  it("reads the municipality the address opens with", () => {
    expect(place("港区芝浦１丁目１番１号")).toEqual({ prefecture: "東京都", municipality: "港区" });
    expect(place("大阪市中央区北浜２丁目")).toEqual({ prefecture: "大阪府", municipality: "大阪市" });
    expect(place("北葛城郡王寺町")).toEqual({ prefecture: "奈良県", municipality: "王寺町" });
    expect(place("大和郡山市")).toEqual({ prefecture: "奈良県", municipality: "大和郡山市" });
    expect(place("四日市市")).toEqual({ prefecture: "三重県", municipality: "四日市市" });
  });

  it("does not read 「長野市県町」 as a prefecture", () => {
    expect(place("長野市県町４７６番地")).toEqual({ prefecture: "長野県", municipality: "長野市" });
  });

  it("never guesses between prefectures that share a municipality name", () => {
    expect(place("府中市日鋼町")).toHaveProperty("reason");
    expect(place("東京都府中市日鋼町")).toEqual({ prefecture: "東京都", municipality: "府中市" });
    expect(place("広島県府中市")).toEqual({ prefecture: "広島県", municipality: "府中市" });
  });

  it("leaves out an address abroad or without a municipality", () => {
    expect(place("シンガポール共和国、コーリヤー・キー２０")).toHaveProperty("reason");
    expect(place("赤坂３－１６－１１")).toHaveProperty("reason");
  });
});

describe("headquarters data and map", () => {
  it("places only companies the encyclopedia has", () => {
    const ids = new Set(companies.map((c) => c.id));
    expect(Object.keys(headquarters.companies).filter((id) => !ids.has(id))).toEqual([]);
  });

  it("draws every prefecture once, with a page id for each", () => {
    expect(map.prefectures.map((p) => p.code)).toEqual(PREFECTURES.map((p) => p.code));
  });
});
