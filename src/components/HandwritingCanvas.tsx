import UndoIcon from "@mui/icons-material/Undo";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { StrokeOrderDisplay } from "./StrokeOrderDisplay";

// Google Input Tools API 互換の stroke 形式: [x[], y[], t[]]
export type Stroke = [number[], number[], number[]];

export type Question = {
  text: string;
  ruby: string[];
  correct: string[];
};

// 1文字あたりのセルサイズ (px)
export const CANVAS_CELL = 200;

export type JudgmentResult = {
  recognized: string;
  correct: string;
  isCorrect: boolean;
};

// ────────────────────────────────────────────────
// テキストを「文字」セグメントと「canvas」セグメントに分解する
// 例: "子ども〇の〇〇さん" →
//   [{type:"text","子ども"}, {type:"canvas",count:1,rubyIdx:0},
//    {type:"text","の"}, {type:"canvas",count:2,rubyIdx:1},
//    {type:"text","さん"}]
// ────────────────────────────────────────────────
type Segment = { type: "text"; content: string } | { type: "canvas"; count: number; rubyIdx: number };

function parseSegments(text: string): Segment[] {
  const result: Segment[] = [];
  let rubyIdx = 0;
  let i = 0;
  let buf = "";

  while (i < text.length) {
    if (text[i] === "〇") {
      if (buf) {
        result.push({ type: "text", content: buf });
        buf = "";
      }
      let count = 0;
      while (i < text.length && text[i] === "〇") {
        count++;
        i++;
      }
      result.push({ type: "canvas", count, rubyIdx: rubyIdx++ });
    } else {
      buf += text[i];
      i++;
    }
  }
  if (buf) result.push({ type: "text", content: buf });
  return result;
}

// ────────────────────────────────────────────────
// 1グループ分の描画 canvas（内部コンポーネント）
// ────────────────────────────────────────────────
type DrawableCanvasProps = {
  charCount: number;
  onStrokesChange: (strokes: Stroke[]) => void;
  judgment?: JudgmentResult;
};

function DrawableCanvas({ charCount, onStrokesChange, judgment }: DrawableCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const onChangeRef = useRef(onStrokesChange);
  const [strokeCount, setStrokeCount] = useState(0);

  const w = CANVAS_CELL;
  const h = CANVAS_CELL * charCount;

  // 最新のコールバックを ref に保持
  useEffect(() => {
    onChangeRef.current = onStrokesChange;
  });

  // canvas を初期状態（描画スタイル設定）にする
  const initCtx = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash([]);
    },
    [w, h],
  );

  const redraw = useCallback(
    (strokes: Stroke[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      initCtx(ctx);
      for (const [xs, ys] of strokes) {
        if (xs.length === 0) continue;
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (let i = 1; i < xs.length; i++) {
          ctx.lineTo(xs[i], ys[i]);
        }
        ctx.stroke();
      }
    },
    [initCtx],
  );

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    initCtx(ctx);
    strokesRef.current = [];
    setStrokeCount(0);
    onChangeRef.current([]);
  }, [initCtx]);

  const undo = useCallback(() => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    redraw(strokesRef.current);
    onChangeRef.current(strokesRef.current);
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    initCtx(ctx);

    let isDrawing = false;
    let curX: number[] = [];
    let curY: number[] = [];
    let curT: number[] = [];
    let startTime = 0;

    const getPos = (e: MouseEvent | Touch) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: Math.round(e.clientX - r.left),
        y: Math.round(e.clientY - r.top),
      };
    };

    const onStart = (x: number, y: number) => {
      isDrawing = true;
      startTime = Date.now();
      curX = [x];
      curY = [y];
      curT = [0];
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const onMove = (x: number, y: number) => {
      if (!isDrawing) return;
      ctx.lineTo(x, y);
      ctx.stroke();
      curX.push(x);
      curY.push(y);
      curT.push(Date.now() - startTime);
    };

    const onEnd = () => {
      if (!isDrawing) return;
      isDrawing = false;
      if (curX.length > 0) {
        const stroke: Stroke = [[...curX], [...curY], [...curT]];
        strokesRef.current = [...strokesRef.current, stroke];
        setStrokeCount(strokesRef.current.length);
        onChangeRef.current(strokesRef.current);
      }
      curX = [];
      curY = [];
      curT = [];
    };

    const onMD = (e: MouseEvent) => {
      const p = getPos(e);
      onStart(p.x, p.y);
    };
    const onMM = (e: MouseEvent) => {
      const p = getPos(e);
      onMove(p.x, p.y);
    };
    const onTS = (e: TouchEvent) => {
      e.preventDefault();
      const p = getPos(e.touches[0]);
      onStart(p.x, p.y);
    };
    const onTM = (e: TouchEvent) => {
      e.preventDefault();
      const p = getPos(e.touches[0]);
      onMove(p.x, p.y);
    };

    canvas.addEventListener("mousedown", onMD);
    canvas.addEventListener("mousemove", onMM);
    canvas.addEventListener("mouseup", onEnd);
    canvas.addEventListener("mouseleave", onEnd);
    canvas.addEventListener("touchstart", onTS, { passive: false });
    canvas.addEventListener("touchmove", onTM, { passive: false });
    canvas.addEventListener("touchend", onEnd);

    return () => {
      canvas.removeEventListener("mousedown", onMD);
      canvas.removeEventListener("mousemove", onMM);
      canvas.removeEventListener("mouseup", onEnd);
      canvas.removeEventListener("mouseleave", onEnd);
      canvas.removeEventListener("touchstart", onTS);
      canvas.removeEventListener("touchmove", onTM);
      canvas.removeEventListener("touchend", onEnd);
    };
  }, [w, h, initCtx]);

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-start" gap={1}>
      {/* クリアボタン + 判定結果 を縦に並べる */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={3} mt={0.5} width={80}>
        <Button
          variant="outlined"
          size="small"
          onClick={clear}
          disabled={strokeCount === 0}
          sx={{ writingMode: "vertical-rl", minWidth: 40 }}
        >
          クリア
        </Button>
        <Button
          size="small"
          onClick={undo}
          variant="outlined"
          disabled={strokeCount === 0}
          startIcon={<UndoIcon fontSize="small" />}
          sx={{ minWidth: 40, minHeight: 40, span: { margin: 0 } }}
        ></Button>
        {judgment && (
          <Box display="flex" flexDirection="column" alignItems="center" gap={1} position="absolute" marginTop={16}>
            <Typography variant="h5" color={judgment.isCorrect ? "success.main" : "error.main"}>
              {judgment.isCorrect ? "○" : "✗"}
            </Typography>
            {!judgment.isCorrect && (
              <Typography variant="body2" sx={{ writingMode: "vertical-rl" }}>
                {judgment.recognized}
              </Typography>
            )}
            <StrokeOrderDisplay correct={[judgment.correct]} showLabel={false} flexDirection="column" />
          </Box>
        )}
      </Box>
      <Box
        component="canvas"
        ref={canvasRef}
        width={w}
        height={h}
        sx={{
          border: "2px solid",
          borderColor: "divider",
          borderRadius: 1,
          cursor: "crosshair",
          touchAction: "none",
          backgroundColor: "background.paper",
        }}
      />
    </Box>
  );
}

// ────────────────────────────────────────────────
// 公開コンポーネント
// ────────────────────────────────────────────────
type Props = {
  question?: Question | null;
  onStrokesChange?: (groups: Stroke[][]) => void;
  judgments?: JudgmentResult[];
};

export function HandwritingCanvas({ question, onStrokesChange, judgments }: Props) {
  const onChangeRef = useRef(onStrokesChange);
  const groupStrokesRef = useRef<Stroke[][]>([]);

  useEffect(() => {
    onChangeRef.current = onStrokesChange;
  });

  // 問題が変わったらストロークをリセット
  useEffect(() => {
    const n = question ? (question.text.match(/〇+/g) ?? []).length : 1;
    groupStrokesRef.current = Array.from({ length: n }, () => []);
    onChangeRef.current?.([...groupStrokesRef.current]);
  }, [question]);

  const handleChange = useCallback((groupIdx: number, strokes: Stroke[]) => {
    groupStrokesRef.current[groupIdx] = strokes;
    onChangeRef.current?.([...groupStrokesRef.current]);
  }, []);

  // question なし → なにも表示しない
  if (!question) {
    return null;
  }

  const segments = parseSegments(question.text);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      {segments.map((seg, idx) => {
        if (seg.type === "text") {
          return (
            <Typography
              key={`${question.text}-${idx}`}
              variant="h4"
              fontWeight="bold"
              whiteSpace="nowrap"
              sx={{ writingMode: "vertical-rl" }}
              height="fit-content"
            >
              {seg.content}
            </Typography>
          );
        }

        return (
          // key に question.text を含めて問題切替時に確実に再マウント
          <Box key={`${question.text}-${idx}`} display="flex" flexDirection="row" alignItems="center" gap={1} mr={6}>
            <DrawableCanvas
              charCount={seg.count}
              onStrokesChange={(s) => handleChange(seg.rubyIdx, s)}
              judgment={judgments?.[seg.rubyIdx]}
            />
            {/* ふりがなを canvas の右横に縦書きで表示 */}
            <Typography variant="body1" color="text.secondary" sx={{ writingMode: "vertical-rl", letterSpacing: 2 }}>
              {question.ruby[seg.rubyIdx]}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
