import * as THREE from 'three';
import React from 'react';
import { type ThreeElements } from '@react-three/fiber';
export type Api = {
    selected: THREE.Object3D[];
    select: React.Dispatch<React.SetStateAction<THREE.Object3D[]>>;
    enabled: boolean;
};
export type SelectApi = Omit<ThreeElements['group'], 'ref'> & {
    enabled?: boolean;
};
export declare const selectionContext: React.Context<Api | null>;
export declare function Selection({ children, enabled }: {
    enabled?: boolean;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function Select({ enabled, children, ...props }: SelectApi): import("react/jsx-runtime").JSX.Element;
