import React, { RefObject } from 'react';
import { Vector2 } from 'three';
import * as THREE from 'three';
import { type ThreeElement } from '@react-three/fiber';
import type { Effect, Pass, BlendFunction } from 'postprocessing';
export declare const resolveRef: <T>(ref: T | React.RefObject<T>) => T;
export type EffectConstructor = new (...args: any[]) => Effect | Pass;
export type EffectProps<T extends EffectConstructor> = ThreeElement<T> & ConstructorParameters<T>[0] & {
    blendFunction?: BlendFunction;
    opacity?: number;
};
export declare const wrapEffect: <T extends EffectConstructor>(effect: T, defaults?: EffectProps<T> | undefined) => ({ blendFunction, opacity, ...props }: {
    [x: string]: any;
    blendFunction?: any;
    opacity?: any;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useVector2: (props: Record<string, unknown>, key: string) => THREE.Vector2;
