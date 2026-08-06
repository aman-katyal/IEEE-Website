import { describe, it, expect } from "vitest";
import { getOrderedLeaders } from "./officersUtils";
import { Leader } from "../../data/leadership";

describe("getOrderedLeaders", () => {
  const leaders: Leader[] = [
    { _id: "1", name: "Alice", email: "alice@test.com", role: "President" },
    { _id: "2", name: "Bob", email: "bob@test.com", role: "Secretary" },
    { _id: "3", name: "Charlie", email: "charlie@test.com", role: "AESC Chair" },
    { _id: "4", name: "David", email: "david@test.com", role: "Head of Operations" },
    { _id: "5", name: "Eve", email: "eve@test.com", role: "General Member" },
    { _id: "6", name: "Frank", email: "frank@test.com", role: "Treasurer", category: "executive" },
    { _id: "7", name: "Grace", email: "grace@test.com", role: "Custom Role", category: "technical" },
  ];

  it("filters by explicit category if available", () => {
    // Frank has explicit category 'executive'
    const result = getOrderedLeaders(leaders, null, "executive");
    expect(result.some(l => l.name === "Frank")).toBe(true);

    // Grace has explicit category 'technical'
    const resultTech = getOrderedLeaders(leaders, null, "technical");
    expect(resultTech.some(l => l.name === "Grace")).toBe(true);
  });

  describe("fallback logic based on role", () => {
    it("infers 'executive' from role", () => {
      const result = getOrderedLeaders(leaders, null, "executive");
      expect(result.some(l => l.name === "Alice")).toBe(true); // President
      expect(result.some(l => l.name === "Bob")).toBe(true); // Secretary
    });

    it("infers 'technical' from role", () => {
      const result = getOrderedLeaders(leaders, null, "technical");
      expect(result.some(l => l.name === "Charlie")).toBe(true); // AESC Chair
    });

    it("infers 'operations' from role", () => {
      const result = getOrderedLeaders(leaders, null, "operations");
      expect(result.some(l => l.name === "David")).toBe(true); // Head of Operations
    });

    it("infers 'member' for unknown roles", () => {
      const result = getOrderedLeaders(leaders, null, "member");
      expect(result.some(l => l.name === "Eve")).toBe(true); // General Member
    });
  });

  it("returns unsorted array if config is null/undefined", () => {
    const result = getOrderedLeaders(leaders, null, "executive");
    expect(result.length).toBeGreaterThan(0);
  });

  describe("sorting based on config order", () => {
    it("sorts executives based on config.executiveOrder", () => {
      // Bob before Alice before Frank
      const config = {
        executiveOrder: [{ _id: "2" }, { _id: "1" }, { _id: "6" }],
      };
      const result = getOrderedLeaders(leaders, config, "executive");
      expect(result.length).toBe(3);
      expect(result[0]._id).toBe("2");
      expect(result[1]._id).toBe("1");
      expect(result[2]._id).toBe("6");
    });

    it("sorts technical based on config.technicalOrder", () => {
      const config = {
        technicalOrder: [{ _id: "7" }, { _id: "3" }],
      };
      const result = getOrderedLeaders(leaders, config, "technical");
      expect(result.length).toBe(2);
      expect(result[0]._id).toBe("7");
      expect(result[1]._id).toBe("3");
    });

    it("sorts operations based on config.operationsOrder", () => {
      const config = {
        operationsOrder: [{ _id: "4" }],
      };
      const result = getOrderedLeaders(leaders, config, "operations");
      expect(result.length).toBe(1);
      expect(result[0]._id).toBe("4");
    });

    it("sorts members based on config.memberOrder", () => {
      const config = {
        memberOrder: [{ _id: "5" }],
      };
      const result = getOrderedLeaders(leaders, config, "member");
      expect(result.length).toBe(1);
      expect(result[0]._id).toBe("5");
    });

    it("pushes leaders not in orderArray to the end", () => {
      // Alice is not in the order config
      const config = {
        executiveOrder: [{ _id: "6" }, { _id: "2" }],
      };
      const result = getOrderedLeaders(leaders, config, "executive");

      // We have 3 executives: Alice (1), Bob (2), Frank (6)
      // Config specifies 6 then 2. 1 is missing, so it should be last.
      expect(result.length).toBe(3);
      expect(result[0]._id).toBe("6"); // Frank
      expect(result[1]._id).toBe("2"); // Bob
      expect(result[2]._id).toBe("1"); // Alice
    });

    it("maintains relative order of leaders not in orderArray", () => {
      const moreLeaders: Leader[] = [
        ...leaders,
        { _id: "8", name: "Hannah", email: "hannah@test.com", role: "VP" }, // maps to member
        { _id: "9", name: "Ian", email: "ian@test.com", role: "Member" }, // maps to member
      ];

      const config = {
        memberOrder: [{ _id: "5" }],
      };

      const result = getOrderedLeaders(moreLeaders, config, "member");
      // Members are Eve (5), Hannah (8), Ian (9)
      expect(result.length).toBe(3);
      expect(result[0]._id).toBe("5"); // Eve is first (in config)
      // 8 and 9 are missing from config. They should retain original relative order.
      // Sort logic for both index === -1 is `return 0` so it maintains stable sort.
      expect(result[1]._id).toBe("8");
      expect(result[2]._id).toBe("9");
    });
  });
});
