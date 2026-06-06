import { ChromaticAberrationEffect } from 'postprocessing';
import { type EffectProps } from '../util';
export type ChromaticAberrationProps = EffectProps<typeof ChromaticAberrationEffect>;
export declare const ChromaticAberration: ({ blendFunction, opacity, ...props }: {
    [x: string]: any;
    blendFunction?: any;
    opacity?: any;
}) => import("react/jsx-runtime").JSX.Element;
