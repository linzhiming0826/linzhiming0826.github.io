import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {SunriseLandscape} from './SunriseLandscape';

const fps = 30;
const durationInFrames = 8 * fps;

const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="SunriseLandscapePC"
        component={SunriseLandscape}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
      />
      <Composition
        id="SunriseLandscapeM"
        component={SunriseLandscape}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
      />
    </>
  );
};

registerRoot(Root);
