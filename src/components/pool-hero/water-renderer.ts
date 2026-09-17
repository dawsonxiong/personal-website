import type { createWaterEffects } from "./water-effects";
import { waterFragmentShader, waterVertexShader } from "./water-shaders";

const MAX_PIXEL_RATIO = 1.5;
const MAX_RENDER_PIXELS = 1_100_000;

export interface WaterRenderer {
  draw: (seconds: number, effects: ReturnType<typeof createWaterEffects>) => void;
  resize: () => void;
  /** Scales the drawing buffer. The shader is fragment bound, so cost tracks pixels. */
  setQuality: (scale: number) => void;
  dispose: () => void;
}

export function createWaterRenderer(canvas: HTMLCanvasElement): WaterRenderer | null {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  const vertexBuffer = gl.createBuffer();

  const dispose = () => {
    for (const shader of shaders) gl.deleteShader(shader);
    gl.deleteBuffer(vertexBuffer);
    gl.deleteProgram(program);
  };

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, waterVertexShader);
  const fragment = compile(gl.FRAGMENT_SHADER, waterFragmentShader);
  if (!program || !vertexBuffer || !vertex || !fragment) {
    dispose();
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Pool shader could not initialize:",
      gl.getProgramInfoLog(program),
      ...shaders.map((shader) => gl.getShaderInfoLog(shader)),
    );
    dispose();
    return null;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const resolution = gl.getUniformLocation(program, "uResolution");
  const viewport = gl.getUniformLocation(program, "uViewport");
  const time = gl.getUniformLocation(program, "uTime");
  const floaties = gl.getUniformLocation(program, "uFloaties[0]");
  const wake = gl.getUniformLocation(program, "uRipples[0]");
  const rippleSizes = gl.getUniformLocation(program, "uRippleSizes[0]");
  let quality = 1;

  return {
    setQuality(scale) {
      quality = scale;
    },
    resize() {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      const ratio =
        Math.min(
          window.devicePixelRatio || 1,
          MAX_PIXEL_RATIO,
          Math.sqrt(MAX_RENDER_PIXELS / (width * height)),
        ) * quality;
      const renderWidth = Math.max(1, Math.round(width * ratio));
      const renderHeight = Math.max(1, Math.round(height * ratio));
      if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
        canvas.width = renderWidth;
        canvas.height = renderHeight;
      }
      gl.viewport(0, 0, renderWidth, renderHeight);
      gl.uniform2f(resolution, renderWidth, renderHeight);
      gl.uniform2f(viewport, width, height);
    },
    draw(seconds, effects) {
      gl.uniform1f(time, seconds);
      gl.uniform3fv(floaties, effects.floaties);
      gl.uniform4fv(wake, effects.ripples);
      gl.uniform1fv(rippleSizes, effects.rippleSizes);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose,
  };
}
