import { BlendFunction, Effect } from 'postprocessing';
export declare class WaterEffectImpl extends Effect {
    constructor({ blendFunction, factor }?: {
        blendFunction?: BlendFunction | undefined;
        factor?: number | undefined;
    });
}
export declare const WaterEffect: ({ blendFunction, opacity, ...props }: {
    [x: string]: any;
    blendFunction?: any;
    opacity?: any;
}) => import("react/jsx-runtime").JSX.Element;
