export const floatieCatalog = [
  { kind: "duck", label: "Duck", collisionScale: 0.42 },
  { kind: "ring", label: "Buoy", collisionScale: 0.5 },
  { kind: "ball", label: "Beach ball", collisionScale: 0.5 },
  { kind: "donut", label: "Donut float", collisionScale: 0.5 },
  { kind: "watermelon", label: "Watermelon", collisionScale: 0.5 },
  { kind: "turtle", label: "Turtle", collisionScale: 0.5 },
] as const;

export type FloatieKind = (typeof floatieCatalog)[number]["kind"];
export const MAX_FLOATIES = 8;
