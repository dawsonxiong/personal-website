export const waterVertexShader = `#version 300 es
in vec2 aPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const waterFragmentShader = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform vec2 uViewport;
uniform float uTime;
uniform vec3 uDuck;
uniform vec4 uRipples[6];
out vec4 fragColor;

const mat2 TURN = mat2(0.80, -0.60, 0.60, 0.80);

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash22(i).x;
  float b = hash22(i + vec2(1.0, 0.0)).x;
  float c = hash22(i + vec2(0.0, 1.0)).x;
  float d = hash22(i + vec2(1.0)).x;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.55 * noise(p);
  p = TURN * p * 2.03 + 7.1;
  value += 0.28 * noise(p);
  p = TURN * p * 2.01 + 3.4;
  return value + 0.17 * noise(p);
}

// Two nearest moving wave cells. Distorting the domain bends their shared
// ridges into an irregular network of light, rather than a sliding texture.
float cellEdge(vec2 p, float t) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float nearest = 8.0;
  float second = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 seed = hash22(cell + offset);
      vec2 site = 0.5 + 0.34 * sin(seed * 6.283185 + t);
      float distanceToSite = length(offset + site - local);
      second = min(second, max(nearest, distanceToSite));
      nearest = min(nearest, distanceToSite);
    }
  }
  return second - nearest;
}

// Overlapping, smoothly varying shadows give the larger light shapes a soft
// focus. Unlike nearest-cell edges, they have no polygon-shaped creases.
float cloudLight(vec2 p, float t) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float density = 0.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 seed = hash22(cell + offset);
      vec2 site = 0.5 + 0.36 * sin(seed * 6.283185 + t);
      vec2 delta = (offset + site - local) * vec2(1.0, 0.86);
      density += exp(-dot(delta, delta) * 5.0) * (0.75 + seed.x * 0.5);
    }
  }
  return 1.0 - smoothstep(0.20, 1.52, density);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = (uv - 0.5) * uViewport / min(uViewport.x, uViewport.y) * 3.6;
  float t = uTime * 0.35;

  vec2 current = vec2(
    fbm(p * 0.78 + vec2(t * 0.16, -t * 0.11)),
    fbm(p * 0.81 + vec2(5.4 - t * 0.12, 2.3 + t * 0.14))
  );
  vec2 bend = current - 0.5;
  vec2 refracted = p + bend * 0.33;
  refracted += 0.015 * vec2(
    sin(p.y * 7.0 + t * 2.4 + current.x * 4.0),
    sin(p.x * 6.0 - t * 2.1 + current.y * 4.0)
  );

  float wakeLight = 0.0;
  vec2 surfacePixel = vec2(uv.x, 1.0 - uv.y) * uViewport;
  for (int i = 0; i < 6; i++) {
    float age = uTime - uRipples[i].z;
    if (uRipples[i].w > 0.0 && age >= 0.0 && age < 1.7) {
      vec2 delta = surfacePixel - uRipples[i].xy;
      float distanceFromWake = length(delta);
      float radius = uDuck.z * (0.20 + age * 0.65);
      float band = (distanceFromWake - radius) / (1.0 + uDuck.z * 0.045);
      float ring = exp(-band * band) * exp(-age * 2.0);
      ring *= (1.0 - smoothstep(1.1, 1.7, age)) * uRipples[i].w;
      wakeLight += ring;
      vec2 normal = delta / max(distanceFromWake, 0.001) * vec2(1.0, -1.0);
      refracted += normal * ring * band * 0.007;
    }
  }

  vec2 cloudDomain = refracted * 0.72 + bend * 1.25;
  cloudDomain += 0.12 * vec2(sin(p.y * 2.4 + t), cos(p.x * 2.1 - t));
  float broadLight = cloudLight(cloudDomain, t * 0.48);
  float cloud = fbm(refracted * 1.12 - vec2(t * 0.10, t * 0.06));
  float light = clamp(0.30 + broadLight * 0.43 + cloud * 0.10, 0.0, 1.0);

  vec3 deepBlue = vec3(0.035, 0.290, 0.970);
  vec3 litBlue = vec3(0.490, 0.795, 0.995);
  vec3 color = mix(deepBlue, litBlue, light);

  // A faint pool-floor shadow bends with the same refraction as the tiles.
  if (uDuck.z > 0.0) {
    float worldScale = 3.6 / min(uViewport.x, uViewport.y);
    vec2 duckCenter = vec2(uDuck.x - uViewport.x * 0.5, uViewport.y * 0.5 - uDuck.y);
    vec2 shadowCenter = (duckCenter + vec2(0.13, -0.28) * uDuck.z) * worldScale;
    vec2 shadowUV = (refracted - shadowCenter) / (uDuck.z * worldScale * vec2(0.38, 0.48));
    color *= 1.0 - exp(-dot(shadowUV, shadowUV) * 1.7) * 0.14;
  }

  vec2 tiles = refracted / 0.34;
  vec2 tileEdge = min(fract(tiles), 1.0 - fract(tiles));
  vec2 lineWidth = fwidth(tiles) * 1.15 + 0.013;
  vec2 tileLines = 1.0 - smoothstep(vec2(0.0), lineWidth, tileEdge);
  float grout = max(tileLines.x, tileLines.y);
  float tileVariation = hash22(floor(tiles)).x - 0.5;
  color += tileVariation * 0.015;
  color *= 1.0 - grout * 0.10 * (1.0 - broadLight * 0.70);

  vec2 detailDomain = refracted + 0.04 * vec2(
    sin(refracted.y * 11.0 + t * 2.0), cos(refracted.x * 9.0 - t * 1.7)
  );
  float edgeA = cellEdge(detailDomain * 2.7 + current * 0.75, t * 1.8);
  float edgeB = cellEdge(TURN * detailDomain * 4.6 - current * 0.55 + 4.2, -t * 1.35);
  float causticA = exp(-edgeA * 26.0) * 0.7 + exp(-edgeA * 8.0) * 0.3;
  float causticB = exp(-edgeB * 28.0);
  float caustics = causticA * 0.12 + causticB * 0.03;
  color = mix(color, vec3(0.73, 0.91, 1.0), caustics * (0.6 + 0.4 * broadLight));

  // A soft veil of scattered light keeps the floor submerged in blue water.
  float veil = smoothstep(0.35, 0.83, cloud) * 0.06;
  color = mix(color, vec3(0.58, 0.83, 1.0), veil);
  color = mix(color, vec3(0.70, 0.91, 1.0), min(wakeLight * 0.10, 0.14));
  fragColor = vec4(color, 1.0);
}
`;
