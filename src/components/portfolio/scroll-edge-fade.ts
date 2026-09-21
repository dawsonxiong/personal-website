/** Fade an edge only while that edge has clipped content — never when parked there. */
export function syncScrollEdgeFade(
  scroller: HTMLElement,
  axis: "x" | "y",
  target: HTMLElement,
  startAttr: "fadeTop" | "fadeLeft",
  endAttr: "fadeBottom" | "fadeRight",
) {
  let atStart: boolean;
  let atEnd: boolean;

  if (axis === "x") {
    // Geometry for horizontal rows: scrollLeft lies with snap/subpixels, and
    // Dialog wrappers can confuse scrollWidth. Only consider marked items so
    // nested scrollers don't pollute a parent panel's vertical fade.
    const scrollerRect = scroller.getBoundingClientRect();
    const items = scroller.querySelectorAll<HTMLElement>(":scope [data-fade-item]");
    const first = items[0];
    const last = items[items.length - 1];

    if (!first || !last) {
      delete target.dataset[startAttr];
      delete target.dataset[endAttr];
      return;
    }

    const firstRect = first.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();
    const edge = 2;
    atStart = firstRect.left >= scrollerRect.left - edge;
    atEnd = lastRect.right <= scrollerRect.right + edge;
  } else {
    const { scrollTop, scrollHeight, clientHeight } = scroller;
    const overflow = scrollHeight > clientHeight + 1;
    atStart = !overflow || scrollTop <= 1;
    atEnd = !overflow || scrollTop + clientHeight >= scrollHeight - 1;
  }

  if (atStart) delete target.dataset[startAttr];
  else target.dataset[startAttr] = "true";

  if (atEnd) delete target.dataset[endAttr];
  else target.dataset[endAttr] = "true";
}
