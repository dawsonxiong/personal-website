import assert from "node:assert/strict";
import test from "node:test";
import { syncScrollEdgeFade } from "./scroll-edge-fade.ts";

function rect(left: number, top: number, width: number, height: number) {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON() {
      return this;
    },
  } satisfies DOMRect;
}

function makeVerticalScroller(metrics: { scroll: number; size: number; scrollSize: number }) {
  return {
    scrollTop: metrics.scroll,
    clientHeight: metrics.size,
    scrollHeight: metrics.scrollSize,
    dataset: {},
  } as unknown as HTMLElement;
}

function makeHorizontalScroller(scrollerBox: DOMRect, itemBoxes: DOMRect[]) {
  return {
    getBoundingClientRect: () => scrollerBox,
    querySelectorAll: (selector: string) => {
      if (!selector.includes("data-fade-item")) return [];
      return itemBoxes.map((box) => ({
        getBoundingClientRect: () => box,
      }));
    },
    dataset: {},
  } as unknown as HTMLElement;
}

function makeTarget() {
  return { dataset: {} as DOMStringMap } as unknown as HTMLElement;
}

test("clears both fades when content fits", () => {
  const scroller = makeVerticalScroller({ scroll: 0, size: 400, scrollSize: 400 });
  const target = makeTarget();
  target.dataset.fadeTop = "true";
  target.dataset.fadeBottom = "true";

  syncScrollEdgeFade(scroller, "y", target, "fadeTop", "fadeBottom");

  assert.equal(target.dataset.fadeTop, undefined);
  assert.equal(target.dataset.fadeBottom, undefined);
});

test("fades only the bottom while parked at the top with overflow", () => {
  const scroller = makeVerticalScroller({ scroll: 0, size: 400, scrollSize: 900 });
  const target = makeTarget();

  syncScrollEdgeFade(scroller, "y", target, "fadeTop", "fadeBottom");

  assert.equal(target.dataset.fadeTop, undefined);
  assert.equal(target.dataset.fadeBottom, "true");
});

test("fades only the top while parked at the bottom with overflow", () => {
  const scroller = makeVerticalScroller({ scroll: 500, size: 400, scrollSize: 900 });
  const target = makeTarget();

  syncScrollEdgeFade(scroller, "y", target, "fadeTop", "fadeBottom");

  assert.equal(target.dataset.fadeTop, "true");
  assert.equal(target.dataset.fadeBottom, undefined);
});

test("fades both edges while mid-scroll", () => {
  const scroller = makeVerticalScroller({ scroll: 200, size: 400, scrollSize: 900 });
  const target = makeTarget();

  syncScrollEdgeFade(scroller, "y", target, "fadeTop", "fadeBottom");

  assert.equal(target.dataset.fadeTop, "true");
  assert.equal(target.dataset.fadeBottom, "true");
});

test("does not fade left when the first item is fully visible", () => {
  const scroller = makeHorizontalScroller(rect(0, 0, 300, 150), [
    rect(0, 0, 218, 150),
    rect(228, 0, 218, 150),
    rect(456, 0, 218, 150),
    rect(684, 0, 218, 150),
  ]);
  const target = makeTarget();

  syncScrollEdgeFade(scroller, "x", target, "fadeLeft", "fadeRight");

  assert.equal(target.dataset.fadeLeft, undefined);
  assert.equal(target.dataset.fadeRight, "true");
});

test("fades left only once the first item is clipped", () => {
  const scroller = makeHorizontalScroller(rect(0, 0, 300, 150), [
    rect(-40, 0, 218, 150),
    rect(188, 0, 218, 150),
    rect(416, 0, 218, 150),
    rect(644, 0, 218, 150),
  ]);
  const target = makeTarget();

  syncScrollEdgeFade(scroller, "x", target, "fadeLeft", "fadeRight");

  assert.equal(target.dataset.fadeLeft, "true");
  assert.equal(target.dataset.fadeRight, "true");
});
