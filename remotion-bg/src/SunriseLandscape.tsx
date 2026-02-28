import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const Cloud: React.FC<{
  top: number;
  left: number;
  scale: number;
  opacity: number;
  drift: number;
}> = ({top, left, scale, opacity, drift}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: left + drift,
        width: 320 * scale,
        height: 84 * scale,
        borderRadius: 999,
        background:
          'radial-gradient(circle at 30% 35%, rgba(255,247,225,0.95), rgba(255,230,189,0.35) 56%, rgba(255,220,176,0) 82%)',
        filter: 'blur(2px)',
        opacity,
      }}
    />
  );
};

const BoyFacingSun: React.FC<{
  x: number;
  baseY: number;
  scale: number;
  sunStrength: number;
  shadowLength: number;
}> = ({x, baseY, scale, sunStrength, shadowLength}) => {
  const bodyHeight = 152 * scale;
  const shoulderWidth = 52 * scale;
  const headSize = 24 * scale;
  const torsoWidth = 30 * scale;
  const torsoHeight = 64 * scale;
  const legWidth = 14 * scale;
  const legHeight = 54 * scale;
  const armWidth = 12 * scale;
  const armHeight = 58 * scale;
  const armSpread = 10;

  const silhouetteColor = interpolateColors(
    sunStrength,
    [0, 1],
    ['#2c1a0f', '#6f451e'],
  );
  const rimOpacity = interpolate(sunStrength, [0, 1], [0.08, 0.55]);
  const shadowOpacity = interpolate(sunStrength, [0, 1], [0.72, 0.2]);
  const shadowWidth = shoulderWidth * interpolate(sunStrength, [0, 1], [1.85, 1.0]);
  const shadowBlur = interpolate(sunStrength, [0, 1], [0.8, 2.2]);
  const daoEmbossColor = interpolateColors(sunStrength, [0, 1], ['#8b6337', '#bd8a43']);
  const daoGlowColor = interpolateColors(sunStrength, [0, 1], ['#d5a24e', '#ffe8ae']);
  const daoGlowOpacity = interpolate(sunStrength, [0, 1], [0.91, 1]);
  const snap = (value: number) => Math.round(value);
  const bodyLeft = snap(x - shoulderWidth / 2);
  const bodyTop = snap(baseY - bodyHeight);
  const torsoLeft = snap(shoulderWidth / 2 - torsoWidth / 2);
  const daoTop = snap(44 * scale);
  const daoWidth = snap(torsoWidth);
  const daoHeight = snap(22 * scale);
  const daoFontSize = Math.max(8, snap(11 * scale));

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - shadowWidth / 2,
          top: baseY - 4,
          width: shadowWidth,
          height: shadowLength,
          borderRadius: '50%',
          background:
            'linear-gradient(180deg, rgba(38,22,12,0.78) 0%, rgba(38,22,12,0.38) 40%, rgba(38,22,12,0) 100%)',
          opacity: shadowOpacity,
          transform: 'scaleX(1.12)',
          filter: `blur(${shadowBlur}px)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: x - shadowWidth * 0.32,
          top: baseY - 6,
          width: shadowWidth * 0.64,
          height: 16 * scale,
          borderRadius: 999,
          background: 'rgba(52,31,16,0.58)',
          opacity: interpolate(sunStrength, [0, 1], [0.74, 0.28]),
          filter: `blur(${shadowBlur * 0.8}px)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: bodyLeft,
          top: bodyTop,
          width: shoulderWidth,
          height: bodyHeight,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: shoulderWidth / 2 - headSize / 2,
            top: 2 * scale,
            width: headSize,
            height: headSize,
            borderRadius: '50%',
            background: silhouetteColor,
            boxShadow: `0 0 0 ${1.5 * scale}px rgba(255,214,126,${rimOpacity})`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: torsoLeft,
            top: 24 * scale,
            width: torsoWidth,
            height: torsoHeight,
            borderRadius: `${8 * scale}px ${8 * scale}px ${10 * scale}px ${10 * scale}px`,
            background: silhouetteColor,
            boxShadow: `0 0 0 ${1.4 * scale}px rgba(255,206,115,${rimOpacity})`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: torsoLeft + snap(2 * scale),
            top: daoTop - snap(1 * scale),
            width: daoWidth - snap(4 * scale),
            height: daoHeight,
            borderRadius: 999,
            background:
              'radial-gradient(ellipse at 50% 52%, rgba(255,226,164,0.18) 0%, rgba(255,226,164,0.06) 58%, rgba(255,226,164,0) 100%)',
            opacity: interpolate(sunStrength, [0, 1], [0.48, 0.62]),
            mixBlendMode: 'screen',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: torsoLeft,
            top: daoTop,
            width: daoWidth,
            height: daoHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif SC", serif',
            fontSize: `${daoFontSize}px`,
            fontWeight: 700,
            color: daoEmbossColor,
            opacity: interpolate(sunStrength, [0, 1], [0.72, 0.9]),
            textShadow: `0 ${1 * scale}px ${1.2 * scale}px rgba(49,31,16,0.42), 0 0 ${1.2 * scale}px rgba(255,224,164,0.18)`,
            lineHeight: 1,
            userSelect: 'none',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'geometricPrecision',
            letterSpacing: '0.01em',
          }}
        >
          道
        </div>

        <div
          style={{
            position: 'absolute',
            left: torsoLeft,
            top: daoTop,
            width: daoWidth,
            height: daoHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif SC", serif',
            fontSize: `${daoFontSize}px`,
            fontWeight: 700,
            color: daoGlowColor,
            opacity: daoGlowOpacity,
            textShadow: `0 0 ${2.16 * scale}px rgba(255,214,124,0.67), 0 0 ${4.56 * scale}px rgba(255,198,94,0.5), 0 0 ${8.16 * scale}px rgba(255,186,72,0.34)`,
            lineHeight: 1,
            userSelect: 'none',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'geometricPrecision',
            letterSpacing: '0.01em',
            mixBlendMode: 'screen',
          }}
        >
          道
        </div>

        <div
          style={{
            position: 'absolute',
            left: shoulderWidth / 2 - armWidth - 11 * scale,
            top: 30 * scale,
            width: armWidth,
            height: armHeight,
            borderRadius: 999,
            background: silhouetteColor,
            transformOrigin: `${armWidth / 2}px ${6 * scale}px`,
            transform: `rotate(${armSpread}deg)`,
            boxShadow: `0 0 0 ${1 * scale}px rgba(255,205,112,${rimOpacity * 0.9})`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: shoulderWidth / 2 + 11 * scale,
            top: 30 * scale,
            width: armWidth,
            height: armHeight,
            borderRadius: 999,
            background: silhouetteColor,
            transformOrigin: `${armWidth / 2}px ${6 * scale}px`,
            transform: `rotate(${-armSpread}deg)`,
            boxShadow: `0 0 0 ${1 * scale}px rgba(255,205,112,${rimOpacity * 0.9})`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: shoulderWidth / 2 - legWidth - 4 * scale,
            top: 82 * scale,
            width: legWidth,
            height: legHeight,
            borderRadius: `${8 * scale}px`,
            background: silhouetteColor,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: shoulderWidth / 2 + 4 * scale,
            top: 82 * scale,
            width: legWidth,
            height: legHeight,
            borderRadius: `${8 * scale}px`,
            background: silhouetteColor,
          }}
        />
      </div>
    </>
  );
};

export const SunriseLandscape: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();

  const t = frame / (fps * 8);
  const eased = interpolate(t, [0, 1], [0, 1], {
    easing: Easing.bezier(0.32, 0.04, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sunSize = interpolate(eased, [0, 1], [height * 0.11, height * 0.17]);
  const sunY = interpolate(eased, [0, 1], [height * 0.88, height * 0.52]);
  const sunX = width * 0.5;
  const rayRotation = interpolate(frame, [0, durationInFrames], [0, 18]);

  const skyTop = interpolateColors(eased, [0, 1], ['#2f3e63', '#f7d48e']);
  const skyMiddle = interpolateColors(eased, [0, 1], ['#5f6a8f', '#f0b86c']);
  const skyBottom = interpolateColors(eased, [0, 1], ['#7c6482', '#d48a3e']);

  const cloudDriftA = interpolate(frame, [0, durationInFrames], [-40, 54]);
  const cloudDriftB = interpolate(frame, [0, durationInFrames], [30, -40]);

  const hazeOpacity = interpolate(eased, [0, 1], [0.12, 0.46]);
  const landWarmth = interpolate(eased, [0, 1], [0.28, 0.75]);

  const hill1Y = interpolate(eased, [0, 1], [height * 0.77, height * 0.72]);
  const hill2Y = interpolate(eased, [0, 1], [height * 0.83, height * 0.79]);
  const hill3Y = interpolate(eased, [0, 1], [height * 0.91, height * 0.88]);
  const shadowLength = interpolate(eased, [0, 1], [height * 0.34, height * 0.09]);
  const boyScale = width > height ? 1 : 1.3;
  const boyX = width * 0.5;
  const boyBaseY = hill3Y + height * (width > height ? 0.08 : 0.06);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${skyTop} 0%, ${skyMiddle} 42%, ${skyBottom} 100%)`,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 58%, rgba(255,239,185,0.75), rgba(255,239,185,0.22) 40%, rgba(255,239,185,0) 72%)',
          opacity: hazeOpacity,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: sunX - sunSize * 1.22,
          top: sunY - sunSize * 1.22,
          width: sunSize * 2.44,
          height: sunSize * 2.44,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,250,214,0.96) 0%, rgba(255,230,154,0.85) 35%, rgba(255,201,105,0.35) 58%, rgba(255,184,89,0) 100%)',
          transform: `rotate(${rayRotation}deg)`,
          filter: 'blur(1px)',
          mixBlendMode: 'screen',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: sunX - sunSize / 2,
          top: sunY - sunSize / 2,
          width: sunSize,
          height: sunSize,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 35% 35%, rgba(255,255,237,1) 0%, rgba(255,243,196,0.95) 40%, rgba(255,214,118,0.82) 72%, rgba(244,164,64,0.72) 100%)',
          boxShadow:
            '0 0 30px rgba(255,214,120,0.55), 0 0 80px rgba(255,185,84,0.4), 0 0 180px rgba(255,185,84,0.24)',
        }}
      />

      <Cloud top={height * 0.2} left={width * 0.12} scale={1.1} opacity={0.62} drift={cloudDriftA} />
      <Cloud top={height * 0.28} left={width * 0.6} scale={0.9} opacity={0.52} drift={cloudDriftB} />
      <Cloud top={height * 0.38} left={width * 0.28} scale={1.35} opacity={0.44} drift={cloudDriftA * 0.6} />

      <div
        style={{
          position: 'absolute',
          left: -width * 0.04,
          width: width * 1.08,
          top: hill1Y,
          height: height * 0.36,
          background:
            'linear-gradient(180deg, rgba(109,91,78,0.72) 0%, rgba(82,59,42,0.86) 42%, rgba(61,40,23,0.96) 100%)',
          clipPath: 'polygon(0 34%, 10% 26%, 18% 31%, 30% 21%, 44% 29%, 55% 20%, 70% 27%, 82% 17%, 100% 28%, 100% 100%, 0 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: -width * 0.08,
          width: width * 1.16,
          top: hill2Y,
          height: height * 0.34,
          background:
            'linear-gradient(180deg, rgba(130,94,58,0.62) 0%, rgba(109,72,39,0.92) 48%, rgba(77,47,22,0.98) 100%)',
          clipPath: 'polygon(0 38%, 14% 30%, 29% 35%, 43% 27%, 56% 36%, 71% 26%, 83% 33%, 100% 24%, 100% 100%, 0 100%)',
          opacity: 0.9,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: -width * 0.12,
          width: width * 1.24,
          top: hill3Y,
          height: height * 0.34,
          background:
            'linear-gradient(180deg, rgba(139,93,49,0.72) 0%, rgba(104,64,31,0.95) 50%, rgba(74,42,18,1) 100%)',
          clipPath: 'polygon(0 42%, 13% 33%, 24% 40%, 38% 28%, 50% 36%, 63% 30%, 78% 41%, 92% 34%, 100% 39%, 100% 100%, 0 100%)',
          opacity: 0.95,
        }}
      />

      <BoyFacingSun
        x={boyX}
        baseY={boyBaseY}
        scale={boyScale}
        sunStrength={eased}
        shadowLength={shadowLength}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 68%, rgba(255,208,113,0.72), rgba(255,208,113,0.22) 40%, rgba(255,208,113,0) 72%)',
          opacity: landWarmth,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};
