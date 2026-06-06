import { ToneMappingEffect } from 'postprocessing';
import { type EffectProps } from '../util';
export type ToneMappingProps = EffectProps<typeof ToneMappingEffect>;
export declare const ToneMapping: ({ blendFunction, opacity, ...props }: {
    [x: string]: any;
    blendFunction?: any;
    opacity?: any;
}) => import("react/jsx-runtime").JSX.Element;
