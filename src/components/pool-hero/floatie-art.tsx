"use client";

import { useId } from "react";

/*
 * Hand-drawn toys that gradients can't manage. Each is a 100×100 scene lit from the
 * upper left, to match the duck render and the CSS toys in pool-hero.module.css.
 */

const YELLOW = "#f9b91a";
const BLUE = "#2230a3";

const polar = (radius: number, degrees: number) => {
  const angle = (degrees * Math.PI) / 180;
  return [50 + radius * Math.cos(angle), 50 + radius * Math.sin(angle)] as const;
};

/** Sphere lighting: a soft gloss with a hot spot, and the terminator falling away from it. */
function SphereShading({ id }: { id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-shade`} cx="36%" cy="30%" r="72%">
          <stop offset="0.3" stopColor="#0b1440" stopOpacity="0" />
          <stop offset="1" stopColor="#0b1440" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id={`${id}-gloss`} cx="34%" cy="27%" r="40%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-spot`} cx="33%" cy="24%" r="14%">
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${id}-shade)`} />
      <circle cx="50" cy="50" r="48" fill={`url(#${id}-gloss)`} />
      <ellipse
        cx="33"
        cy="24"
        rx="11"
        ry="6"
        fill={`url(#${id}-spot)`}
        transform="rotate(-28 33 24)"
      />
    </>
  );
}

// The blue panels, traced from a photo of the ball (scratch script measured the blue
// pixels and followed their outline; coordinates are percent of the ball's diameter).
const BLUE_PANELS =
  "M 33.2 3.3 L 33.4 3.5 L 33.1 3.8 L 27.1 7.9 L 21.0 13.1 L 16.0 18.5 L 12.4 23.4 L 11.7 25.4 L 12.0 27.7 L 13.7 30.4 L 16.1 32.2 L 20.8 34.1 L 26.1 35.2 L 30.8 35.3 L 47.3 34.8 L 50.9 35.3 L 55.3 36.4 L 59.8 38.2 L 65.3 41.3 L 71.2 45.9 L 77.1 52.0 L 78.2 52.6 L 79.8 52.5 L 81.9 51.6 L 84.8 49.7 L 88.4 46.0 L 90.6 42.1 L 91.8 36.7 L 91.7 32.4 L 90.7 28.0 L 88.2 21.9 L 84.0 14.5 L 83.8 14.0 L 84.0 13.8 L 88.4 18.5 L 91.9 23.5 L 95.0 29.6 L 96.5 36.3 L 96.9 36.8 L 98.1 37.1 L 99.0 42.1 L 99.3 45.6 L 99.0 48.8 L 98.2 52.3 L 95.9 56.7 L 94.4 58.4 L 91.3 61.1 L 89.7 63.8 L 86.8 70.5 L 81.6 84.6 L 79.4 89.2 L 77.2 91.3 L 73.3 92.7 L 72.8 93.7 L 70.1 95.3 L 68.0 96.1 L 65.7 96.4 L 63.5 97.7 L 60.2 98.1 L 59.7 97.5 L 60.2 96.0 L 71.9 78.6 L 73.8 75.6 L 75.0 73.0 L 74.7 71.8 L 73.2 69.8 L 69.0 66.2 L 65.4 64.1 L 61.7 62.4 L 57.9 61.2 L 53.3 60.1 L 47.2 59.7 L 32.5 60.4 L 27.1 59.6 L 22.4 58.3 L 18.4 56.4 L 14.0 53.3 L 11.1 50.3 L 8.1 45.9 L 6.5 44.9 L 4.9 45.3 L 3.5 47.1 L 2.0 50.9 L 1.1 55.7 L 0.9 56.0 L 0.8 55.8 L 0.4 48.3 L 0.7 44.3 L 1.4 40.0 L 5.3 29.5 L 9.0 22.4 L 11.3 19.1 L 13.7 16.2 L 19.7 10.8 L 26.2 6.5 Z";

export function VolleyballArt() {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <clipPath id={`${id}-ball`}>
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-ball)`}>
        <circle cx="50" cy="50" r="48" fill={YELLOW} />
        <path d={BLUE_PANELS} fill={BLUE} />
      </g>
      <SphereShading id={id} />
    </svg>
  );
}

const star = (outer: number, inner: number) =>
  Array.from({ length: 10 }, (_, index) =>
    polar(index % 2 === 0 ? outer : inner, -90 + index * 36).join(" "),
  ).join(" ");
const FLIGHT_RINGS = Array.from({ length: 8 }, (_, index) => 34.6 + index * 1.7);
// Five red comets sit in the gaps between the star's points, measured from the disc:
// r 10–28, about ±12° at the base tapering to a point.
const FANS = Array.from({ length: 5 }, (_, index) => -54 + index * 72);

export function FrisbeeArt() {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        {/* The rim: a rounded lip that catches light on the near side and falls into shade. */}
        <radialGradient id={`${id}-disc`} cx="50%" cy="50%" r="50%">
          <stop offset="0.84" stopColor="#f3f2ee" />
          <stop offset="0.9" stopColor="#dedcd6" />
          <stop offset="0.95" stopColor="#fbfaf8" />
          <stop offset="1" stopColor="#cfcdc7" />
        </radialGradient>
        <radialGradient id={`${id}-shade`} cx="36%" cy="30%" r="70%">
          <stop offset="0.5" stopColor="#1c1c3a" stopOpacity="0" />
          <stop offset="1" stopColor="#1c1c3a" stopOpacity="0.22" />
        </radialGradient>
        <radialGradient id={`${id}-gloss`} cx="34%" cy="28%" r="42%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill={`url(#${id}-disc)`} />
      {/* Fine flight rings moulded into the outer top surface. */}
      {FLIGHT_RINGS.map((radius) => (
        <circle
          key={radius}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#a9a8a3"
          strokeWidth="0.35"
          opacity="0.4"
        />
      ))}
      <circle cx="50" cy="50" r="31" fill="none" stroke="#1f3f8c" strokeWidth="3.2" />
      <g fill="#b12f3a">
        {FANS.map((angle) => (
          <polygon
            key={angle}
            points={[polar(10.5, angle - 12), polar(27.8, angle), polar(10.5, angle + 12)]
              .map((point) => point.join(" "))
              .join(" ")}
          />
        ))}
      </g>
      <polygon
        points={star(21.5, 8.8)}
        fill="#f3f2ee"
        stroke="#1f3f8c"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="49" fill={`url(#${id}-shade)`} />
      <circle cx="50" cy="50" r="49" fill={`url(#${id}-gloss)`} />
    </svg>
  );
}
