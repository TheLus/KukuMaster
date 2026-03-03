import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

async function fetchKanjiSvg(ch: string): Promise<SVGSVGElement> {
  const code = ch.charCodeAt(0).toString(16).toLowerCase().padStart(5, "0");
  const url = `https://kanjivg.tagaini.net/kanjivg/kanji/${code}.svg`;
  const xml = await fetch(url).then((r) => r.text());
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement;
  svg.setAttribute("viewBox", "0 0 109 109");
  svg.style.width = "80px";
  svg.style.height = "80px";
  svg.style.display = "inline-block";
  svg.style.cursor = "pointer";
  svg.innerHTML = xml;
  return svg;
}

// 1 SVG unit あたりのアニメーション時間 (ms)
// KanjiVG の viewBox は 109×109。典型的な1画のパス長は 30〜150 unit 程度。
// 4ms/unit にすると約 120unit の画が 480ms ≈ 0.5秒で描かれる。
const MS_PER_UNIT = 5;

async function animateKanji(svg: SVGSVGElement, signal: AbortSignal) {
  const paths = svg.querySelectorAll<SVGPathElement>("path");
  const numbers = svg.querySelectorAll<SVGTextElement>("text");

  for (const path of paths) path.style.display = "none";
  for (const num of numbers) num.style.display = "none";

  for (let i = 0; i < paths.length; i++) {
    if (signal.aborted) return;
    const path = paths[i];
    const num = numbers[i];
    const length = path.getTotalLength();
    const duration = length * MS_PER_UNIT;

    path.style.display = "block";
    if (num) num.style.display = "block";
    path.style.transition = "none";
    path.style.strokeDasharray = `${length} ${length}`;
    path.style.strokeDashoffset = String(length);
    path.getBoundingClientRect();

    path.style.transition = `stroke-dashoffset ${duration}ms linear`;
    path.style.strokeDashoffset = "0";

    await new Promise<void>((resolve) => setTimeout(resolve, duration));

    // ストローク間の間
    if (i < paths.length - 1) {
      if (signal.aborted) return;
      await new Promise<void>((resolve) => setTimeout(resolve, 150));
    }
  }
}

interface Props {
  correct: string[];
  showLabel?: boolean;
  flexDirection?: "row" | "column";
}

export function StrokeOrderDisplay({ correct, showLabel = true, flexDirection = "row" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const allChars = correct.join("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !allChars) return;

    container.innerHTML = "";
    const controller = new AbortController();

    (async () => {
      const chars = [...allChars];

      // 最初の文字をフェッチ開始
      let nextSvgPromise: Promise<SVGSVGElement | null> = fetchKanjiSvg(chars[0]).catch(() => null);

      for (let i = 0; i < chars.length; i++) {
        if (controller.signal.aborted) break;

        const svg = await nextSvgPromise;

        // 現在の文字のアニメーション中に次の文字をプリフェッチ
        if (i + 1 < chars.length) {
          nextSvgPromise = fetchKanjiSvg(chars[i + 1]).catch(() => null);
        }

        if (!svg || controller.signal.aborted) continue;

        container.appendChild(svg);
        await animateKanji(svg, controller.signal);

        svg.addEventListener("click", () => {
          // @ts-ignore
          if (svg._ac) (svg._ac as AbortController).abort();
          const ac = new AbortController();
          // @ts-ignore
          svg._ac = ac;
          animateKanji(svg, ac.signal);
        });

        // 文字間の間（ストローク間より短め）
        if (i < chars.length - 1) {
          if (controller.signal.aborted) break;
          await new Promise<void>((resolve) => setTimeout(resolve, 80));
        }
      }
    })();

    return () => controller.abort();
  }, [allChars]);

  if (!allChars) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      {showLabel && (
        <Typography variant="body2" color="text.secondary">
          正解の書き順（クリックで再生）
        </Typography>
      )}
      <Box
        ref={containerRef}
        display="flex"
        flexDirection={flexDirection}
        flexWrap="wrap"
        justifyContent="center"
        gap={1}
      />
    </Box>
  );
}
