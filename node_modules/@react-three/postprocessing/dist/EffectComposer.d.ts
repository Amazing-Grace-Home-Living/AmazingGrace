import type { TextureDataType, Camera, Scene } from 'three';
import { type JSX } from 'react';
import { EffectComposer as EffectComposerImpl, NormalPass, DepthDownsamplingPass } from 'postprocessing';
export declare const EffectComposerContext: import("react").Context<{
    composer: EffectComposerImpl;
    normalPass: NormalPass | null;
    downSamplingPass: DepthDownsamplingPass | null;
    camera: Camera;
    scene: Scene;
    resolutionScale?: number | undefined;
}>;
export type EffectComposerProps = {
    enabled?: boolean;
    children: JSX.Element | JSX.Element[];
    depthBuffer?: boolean;
    /** Only used for SSGI currently, leave it disabled for everything else unless it's needed */
    enableNormalPass?: boolean;
    stencilBuffer?: boolean;
    autoClear?: boolean;
    resolutionScale?: number;
    multisampling?: number;
    frameBufferType?: TextureDataType;
    renderPriority?: number;
    camera?: Camera;
    scene?: Scene;
};
export declare const EffectComposer: import("react").NamedExoticComponent<EffectComposerProps & import("react").RefAttributes<EffectComposerImpl>>;
