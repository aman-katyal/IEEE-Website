import { Leader, LeaderReference, OfficersConfig } from "../../data/leadership";

export const getOrderedLeaders = (
  leaders: Leader[],
  config: OfficersConfig | null | undefined,
  categoryId: string,
) => {
  const categoryLeaders = leaders.filter((l: Leader) => {
    // Use explicit category if available
    if (l.category) return l.category === categoryId;

    // Fallback logic in JS
    const role = l.role || "";
    let inferredCategory = "member";

    if (
      role.includes("President") ||
      role.includes("Secretary") ||
      role.includes("Treasurer")
    ) {
      inferredCategory = "executive";
    } else if (
      role.includes("Chair") ||
      role.includes("Lead") ||
      role.includes("MTT-S") ||
      role.includes("AESC") ||
      role.includes("EMBS") ||
      role.includes("SMC") ||
      role.includes("CSOCIETY") ||
      role.includes("RACING") ||
      role.includes("SOFTWARE SATURDAYS")
    ) {
      inferredCategory = "technical";
    } else if (
      role.includes("Head of") ||
      role.includes("Infrastructure") ||
      role.includes("Industrial") ||
      role.includes("Operations")
    ) {
      inferredCategory = "operations";
    }

    return inferredCategory === categoryId;
  });

  if (!config) return categoryLeaders;

  const orderArray =
    categoryId === "executive"
      ? config.executiveOrder
      : categoryId === "technical"
        ? config.technicalOrder
        : categoryId === "operations"
          ? config.operationsOrder
          : config.memberOrder;

  if (!orderArray || orderArray.length === 0) return categoryLeaders;

  // Map _id from orderArray
  const orderedIds = orderArray?.map((ref: LeaderReference) => ref._id) || [];

  const orderMap = new Map<string, number>();
  orderedIds.forEach((id: string, index: number) => orderMap.set(id, index));

  // Sort categoryLeaders based on orderedIds
  const sorted = categoryLeaders.sort((a, b) => {
    // ⚡ Bolt: Optimize Map lookups by combining .has() and .get()
    const indexA = orderMap.get(a._id) ?? -1;
    const indexB = orderMap.get(b._id) ?? -1;

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return sorted;
};
