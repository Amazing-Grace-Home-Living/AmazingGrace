import { describe, it, expect } from "vitest";
import { getHolyEncounter } from "../src/holy/getHolyEncounter.js";
import { getPropheticVision } from "../src/oracle-chamber/getPropheticVision.js";
import { getGuardianChallenge } from "../src/temple-guardians/getGuardianChallenge.js";

describe("Temple Metaphysical Subsystems Evaluators", () => {
  describe("getHolyEncounter", () => {
    it("returns rebuke when corruption is severe (>= 8)", () => {
      const hud = {
        virtueEngine: { truth: 5, love: 5, wisdom: 5, corruption: 8 }
      };
      const result = getHolyEncounter(hud);
      expect(result.type).toBe("rebuke");
    });

    it("returns union when key virtues are outstanding (>= 5) and corruption is low", () => {
      const hud = {
        virtueEngine: { truth: 6, love: 5, wisdom: 7, corruption: 2 }
      };
      const result = getHolyEncounter(hud);
      expect(result.type).toBe("union");
    });

    it("returns silence otherwise", () => {
      const hud = {
        virtueEngine: { truth: 3, love: 4, wisdom: 3, corruption: 1 }
      };
      const result = getHolyEncounter(hud);
      expect(result.type).toBe("silence");
    });
  });

  describe("getPropheticVision", () => {
    it("returns Severe vision under high corruption (>= 7)", () => {
      const hud = {
        virtueEngine: { corruption: 8 },
        progress: { sevenStars: { collected: ["a", "b"] } }
      };
      const result = getPropheticVision(hud);
      expect(result.tone).toBe("Severe");
    });

    it("returns Transcendent vision with full star + lamp resonance", () => {
      const hud = {
        virtueEngine: { corruption: 0 },
        progress: { sevenStars: { collected: ["1", "2", "3", "4", "5", "6", "7"] } },
        lamps: { activated: ["1", "2", "3", "4", "5", "6", "7"] }
      };
      const result = getPropheticVision(hud);
      expect(result.tone).toBe("Transcendent");
    });

    it("returns Gentle vision for high compassion/love", () => {
      const hud = {
        virtueEngine: { corruption: 0, love: 6 },
        progress: { sevenStars: { collected: ["1"] } }
      };
      const result = getPropheticVision(hud);
      expect(result.tone).toBe("Gentle");
    });
  });

  describe("getGuardianChallenge", () => {
    it("denies entry if pilgrim corruption is high (>= 8)", () => {
      const hud = {
        virtueEngine: { corruption: 8, truth: 5, love: 5 }
      };
      const result = getGuardianChallenge(hud);
      expect(result.type).toBe("deny");
    });

    it("challenges with question if truth is undercalibrated (< 3)", () => {
      const hud = {
        virtueEngine: { corruption: 1, truth: 2, love: 5 }
      };
      const result = getGuardianChallenge(hud);
      expect(result.type).toBe("question");
      expect(result.message).toContain("truth");
    });

    it("challenges with question if love is undercalibrated (< 3)", () => {
      const hud = {
        virtueEngine: { corruption: 1, truth: 5, love: 1 }
      };
      const result = getGuardianChallenge(hud);
      expect(result.type).toBe("question");
      expect(result.message).toContain("compassion");
    });

    it("allows entry if all virtue coordinates are aligned", () => {
      const hud = {
        virtueEngine: { corruption: 1, truth: 4, love: 4 }
      };
      const result = getGuardianChallenge(hud);
      expect(result.type).toBe("allow");
    });
  });
});
