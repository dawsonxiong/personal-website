export const floatieCatalog = [
  { kind: "duck", label: "Duck", collisionScale: 0.42 },
  { kind: "ring", label: "Buoy", collisionScale: 0.5 },
  { kind: "ball", label: "Beach ball", collisionScale: 0.5 },
  { kind: "donut", label: "Donut float", collisionScale: 0.5 },
  { kind: "volleyball", label: "Volleyball", collisionScale: 0.5 },
  { kind: "frisbee", label: "Frisbee", collisionScale: 0.5 },
] as const;

export type FloatieKind = (typeof floatieCatalog)[number]["kind"];
export const MAX_FLOATIES = 8;
