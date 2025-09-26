/* eslint-disable react/no-unknown-property */
import React, { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color, Mesh, ShaderMaterial, DoubleSide } from "three";

type Uniforms = {
  uTime: { value: number };
  uColor: { value: Color };
  uSpeed: { value: number };
  uScale: { value: number };
  uRotation: { value: number };
  uNoiseIntensity: { value: number };
};

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

/** Plan plein écran qui met à l’échelle selon le viewport */
const SilkPlane = forwardRef<Mesh, { uniforms: Uniforms }>(function SilkPlane(
  { uniforms },
  ref
) {
  const meshRef = ref as React.MutableRefObject<Mesh | null>;
  const materialRef = useRef<ShaderMaterial | null>(null);
  const { viewport } = useThree();

  // Crée un ShaderMaterial typé (évite l'erreur JSX sur <shaderMaterial ... />)
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        side: DoubleSide,
      }),
    [uniforms]
  );

  useLayoutEffect(() => {
    materialRef.current = material;
    return () => material.dispose();
  }, [material]);

  useLayoutEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [viewport.width, viewport.height, meshRef]);

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (mat) mat.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      {/* on attache le ShaderMaterial via primitive pour éviter les soucis de typings */}
      <primitive object={material} attach="material" />
    </mesh>
  );
});

export type SilkProps = {
  speed?: number;
  scale?: number;
  color?: string;        // hex
  noiseIntensity?: number;
  rotation?: number;     // radians
  className?: string;
};

export default function Silk({
  speed = 5,
  scale = 1,
  color = "#7B7481",
  noiseIntensity = 1.5,
  rotation = 0,
  className,
}: SilkProps) {
  const meshRef = useRef<Mesh | null>(null);

  const uniforms: Uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation]
  );

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop="always"
      gl={{ alpha: true }}
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
}
