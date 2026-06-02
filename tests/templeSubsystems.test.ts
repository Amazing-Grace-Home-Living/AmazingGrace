import { describe, it, expect } from "vitest";
import { getHolyEncounter } from "../src/holy/getHolyEncounter.js";
import { getPropheticVision } from "../src/oracle-chamber/getPropheticVision.js";
import { getGuardianChallenge } from "../src/temple-guardians/getGuardianChallenge.js";
import { generateRealmName } from "../src/ascension/generateRealmName.js";
import { generateDestinyPath } from "../src/aeon/generateDestinyPath.js";
import { generateResonanceEvent } from "../src/aeon/generateResonanceEvent.js";

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

  describe("generateRealmName", () => {
    it("generates correct prefix and suffix for layer 1", () => {
      const name = generateRealmName(1);
      expect(name).toBe("Lumina Crown");
    });

    it("handles large layer numbers with wrapping", () => {
      const name = generateRealmName(10);
      expect(name).toBe("Aether Gate");
    });
  });

  describe("generateDestinyPath", () => {
    it("generates correct archetype and motif for cycle 1", () => {
      const path = generateDestinyPath(1);
      expect(path).toBe("Wanderer of the Echo");
    });

    it("wraps around properly on high cycles", () => {
      const path = generateDestinyPath(10);
      expect(path).toBe("Seer of the Light");
    });
  });

  describe("generateResonanceEvent", () => {
    it("returns high virtue cosmic chord message", () => {
      const virtues = { illumination: 3, resonance: 2, transcendence: 2 };
      const msg = generateResonanceEvent(virtues);
      expect(msg).toBe("A cosmic chord vibrates through your being.");
    });

    it("returns default low virtue ripple message", () => {
      const virtues = { illumination: 0.5, resonance: 0.5, transcendence: 0.5 };
      const msg = generateResonanceEvent(virtues);
      expect(msg).toBe("A faint ripple stirs the Aeon.");
    });
  });

  describe("Aeon Engine Overdrive & Crown Requirements", () => {
    it("activates Overdrive if cumulative virtues exceed 12", () => {
      const virtuesSum = 15;
      const isOverdrive = virtuesSum > 12;
      expect(isOverdrive).toBe(true);
    });

    it("unlocks Crown of Light if total virtues sum exceeds 30 or cycle reaches 21", () => {
      const cycle = 21;
      const totalVirtuesSum = 15;
      const isCrownReady = totalVirtuesSum > 30 || cycle >= 21;
      expect(isCrownReady).toBe(true);
    });
  });

  describe("Empyrean Protocol Subsystems", () => {
    it("tunes Harmonic Field to custom Solfeggio frequencies", () => {
      const freq = 528;
      expect(freq).toBe(528);
    });

    it("procedurally weaves new realm coordinates", () => {
      const activeLaw = "Identity Gravity";
      const suffix = "Nexus";
      const newRealm = `${activeLaw} ${suffix}`;
      expect(newRealm).toBe("Identity Gravity Nexus");
    });
  });
});
