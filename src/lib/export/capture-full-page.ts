import { toPng } from 'html-to-image';

export interface FullPageCaptureOptions {
  filenameBase: string;
  onProgress?: (step: string, currentPart?: number, totalParts?: number) => void;
}

export interface CaptureResult {
  partIndex: number;
  totalParts: number;
  dataUrl: string;
  filename: string;
  width: number;
  height: number;
}

/**
 * Conservative platform limits for browser canvas elements.
 * Safari / iOS limit is strictly 4096px for canvas dimensions,
 * whereas Desktop Chrome allows larger canvases (~8192px+).
 */
const SAFARI_MAX_CANVAS_DIMENSION = 4096;
const DESKTOP_MAX_CANVAS_DIMENSION = 6000;
const MAX_SAFE_SLICE_HEIGHT = 3200; // Safe height per part at 1x

function isSafariOrMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  return isSafari || isMobile;
}

/**
 * Calculates adaptive pixelRatio and slicing plan.
 */
export function calculateCapturePlan(totalHeight: number, totalWidth = 1280) {
  const isMobileDevice = isSafariOrMobile();
  const maxDimension = isMobileDevice
    ? SAFARI_MAX_CANVAS_DIMENSION
    : DESKTOP_MAX_CANVAS_DIMENSION;

  let preferredPixelRatio = isMobileDevice ? 1.5 : 2.0;

  // If single canvas would exceed conservative threshold or height is large, calculate parts
  const isLongPage = totalHeight > MAX_SAFE_SLICE_HEIGHT || (totalHeight * preferredPixelRatio > maxDimension);

  if (!isLongPage) {
    // Fits comfortably in a single image
    // Ensure totalHeight * preferredPixelRatio <= maxDimension
    if (totalHeight * preferredPixelRatio > maxDimension) {
      preferredPixelRatio = Math.max(1, Math.floor((maxDimension / totalHeight) * 10) / 10);
    }

    return {
      pixelRatio: preferredPixelRatio,
      parts: [
        {
          index: 1,
          offsetY: 0,
          height: totalHeight,
        },
      ],
      totalParts: 1,
    };
  }

  // Multi-part capture plan
  const sliceHeight = Math.min(MAX_SAFE_SLICE_HEIGHT, Math.floor(maxDimension / preferredPixelRatio));
  const totalParts = Math.ceil(totalHeight / sliceHeight);
  const parts = [];

  for (let i = 0; i < totalParts; i++) {
    const offsetY = i * sliceHeight;
    const remainingHeight = totalHeight - offsetY;
    const currentHeight = Math.min(sliceHeight, remainingHeight);

    parts.push({
      index: i + 1,
      offsetY,
      height: currentHeight,
    });
  }

  return {
    pixelRatio: preferredPixelRatio,
    parts,
    totalParts,
  };
}

/**
 * Captures full-page HTML node into high-resolution PNGs.
 * If page height exceeds conservative canvas thresholds, it segments
 * the capture into sequential parts (part1, part2, etc.) without creating
 * any giant intermediate canvas, preventing browser OOM or crashes.
 */
export async function captureFullPage(
  targetNode: HTMLElement,
  options: FullPageCaptureOptions
): Promise<CaptureResult[]> {
  const totalHeight = targetNode.scrollHeight || targetNode.offsetHeight;
  const totalWidth = 1280;

  const plan = calculateCapturePlan(totalHeight, totalWidth);
  const results: CaptureResult[] = [];

  for (let i = 0; i < plan.parts.length; i++) {
    const part = plan.parts[i];
    options.onProgress?.(
      plan.totalParts > 1
        ? `Memproses bagian ${part.index} dari ${plan.totalParts}...`
        : 'Menghasilkan gambar resolusi tinggi...',
      part.index,
      plan.totalParts
    );

    let dataUrl: string;

    if (plan.totalParts === 1) {
      dataUrl = await toPng(targetNode, {
        width: totalWidth,
        height: part.height,
        canvasWidth: totalWidth * plan.pixelRatio,
        canvasHeight: part.height * plan.pixelRatio,
        pixelRatio: plan.pixelRatio,
        cacheBust: false,
        style: {
          position: 'static',
          left: '0',
          top: '0',
          margin: '0',
          transform: 'none',
          width: `${totalWidth}px`,
        },
      });
    } else {
      // Multi-part slicing: create a temporary clipping wrapper with overflow: hidden
      // and static positioning to avoid SVG foreignObject transform/relative coordinate bugs.
      const wrapper = document.createElement('div');
      wrapper.style.width = `${totalWidth}px`;
      wrapper.style.height = `${part.height}px`;
      wrapper.style.overflow = 'hidden';
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-10000px';
      wrapper.style.top = '0';
      wrapper.style.pointerEvents = 'none';

      const parent = targetNode.parentNode;
      parent?.insertBefore(wrapper, targetNode);
      wrapper.appendChild(targetNode);

      const prevMarginTop = targetNode.style.marginTop;
      const prevPosition = targetNode.style.position;
      const prevLeft = targetNode.style.left;
      const prevTop = targetNode.style.top;
      const prevTransform = targetNode.style.transform;

      targetNode.style.position = 'static';
      targetNode.style.left = '0';
      targetNode.style.top = '0';
      targetNode.style.transform = 'none';
      targetNode.style.marginTop = `-${part.offsetY}px`;

      try {
        dataUrl = await toPng(wrapper, {
          width: totalWidth,
          height: part.height,
          canvasWidth: totalWidth * plan.pixelRatio,
          canvasHeight: part.height * plan.pixelRatio,
          pixelRatio: plan.pixelRatio,
          cacheBust: false,
          style: {
            position: 'static',
            left: '0',
            top: '0',
            margin: '0',
            transform: 'none',
            width: `${totalWidth}px`,
          },
        });
      } finally {
        targetNode.style.marginTop = prevMarginTop;
        targetNode.style.position = prevPosition;
        targetNode.style.left = prevLeft;
        targetNode.style.top = prevTop;
        targetNode.style.transform = prevTransform;
        if (parent) {
          parent.insertBefore(targetNode, wrapper);
          parent.removeChild(wrapper);
        }
      }
    }

    const cleanBase = options.filenameBase.replace(/\.png$/i, '');
    const filename =
      plan.totalParts > 1
        ? `${cleanBase}-part${part.index}.png`
        : `${cleanBase}-full.png`;

    results.push({
      partIndex: part.index,
      totalParts: plan.totalParts,
      dataUrl,
      filename,
      width: totalWidth,
      height: part.height,
    });
  }

  return results;
}
