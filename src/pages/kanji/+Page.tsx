import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Grid, Link, SxProps, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
  CANVAS_CELL,
  HandwritingCanvas,
  type JudgmentResult,
  type Question,
  type Stroke,
} from "@/components/HandwritingCanvas";
import { useToggle } from "@/hooks/useToggle";
import { useSound } from "@/hooks/useSound";
import { grade3 } from "./questions";

export { Page };

const STORAGE_KEY = "kukumaster_kanji_correct";

function loadCorrectTexts(): Set<string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

function Page() {
  const [is1Grade, toggle1Grade] = useToggle();
  const [is2Grade, toggle2Grade] = useToggle();
  const [is3Grade, toggle3Grade] = useToggle();
  const [is4Grade, toggle4Grade] = useToggle();
  const [is5Grade, toggle5Grade] = useToggle();
  const [is6Grade, toggle6Grade] = useToggle();
  const [selectedKanji, setSelectedKanji] = useState<Question | null>(null);
  const [strokeGroups, setStrokeGroups] = useState<Stroke[][]>([]);
  const [judgments, setJudgments] = useState<JudgmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnlyNotDone, setShowOnlyNotDone] = useState(false);
  const [correctTexts, setCorrectTexts] = useState<Set<string>>(loadCorrectTexts);
  const { play: playCorrect } = useSound("/correct.mp3");
  const { play: playIncorrect } = useSound("/incorrect.mp3", 0.3);

  const allTargets = useMemo(() => {
    let targets: Question[] = [];
    if (is3Grade) targets = [...targets, ...grade3];
    return targets;
  }, [is3Grade]);

  const correctCount = useMemo(
    () => allTargets.filter((q) => correctTexts.has(q.text)).length,
    [allTargets, correctTexts],
  );

  const recognize = useCallback(async () => {
    if (!selectedKanji) return;
    if (strokeGroups.every((g) => g.length === 0)) return;
    setIsLoading(true);
    setJudgments([]);
    try {
      const results = await Promise.all(
        strokeGroups.map(async (strokes, i) => {
          const correct = selectedKanji.correct[i];
          const charCount = correct.length;

          if (strokes.length === 0) {
            return { recognized: "（未記入）", correct, isCorrect: false };
          }

          const res = await fetch("https://inputtools.google.com/request?itc=ja-t-i0-handwrit&num=10", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              app_version: 0.4,
              api_level: "537.36",
              device: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              input_type: 0,
              options: "enable_pre_space",
              requests: [
                {
                  writing_guide: {
                    writing_area_width: CANVAS_CELL,
                    writing_area_height: CANVAS_CELL * charCount,
                  },
                  pre_context: "",
                  max_num_results: 10,
                  max_completions: 0,
                  language: "ja",
                  ink: strokes,
                },
              ],
            }),
          });
          const data = await res.json();
          // レスポンス形式: ["SUCCESS", [["", ["候補1", ...], null, {...}]]]
          if (data[0] === "SUCCESS") {
            const candidates: string[] = data[1][0][1];
            return {
              recognized: candidates[0] ?? "（認識失敗）",
              correct,
              isCorrect: candidates[0] === correct,
            };
          }
          return { recognized: "（認識失敗）", correct, isCorrect: false };
        }),
      );
      setJudgments(results);
      if (results.every((r) => r.isCorrect)) {
        playCorrect();
        setCorrectTexts((prev) => {
          const next = new Set(prev);
          next.add(selectedKanji.text);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
          return next;
        });
      } else {
        playIncorrect();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [strokeGroups, selectedKanji, playCorrect, playIncorrect]);

  const randomSelect = useCallback(() => {
    let targets: Question[] = [];
    // if (is1Grade) {
    //   targets = [...targets, ...grade1];
    // }
    // if (is2Grade) {
    //   targets = [...targets, ...grade2];
    // }
    if (is3Grade) {
      targets = [...targets, ...grade3];
    }
    // if (is4Grade) {
    //   targets = [...targets, ...grade4];
    // }
    // if (is5Grade) {
    //   targets = [...targets, ...grade5];
    // }
    // if (is6Grade) {
    //   targets = [...targets, ...grade6];
    // }
    if (showOnlyNotDone) {
      const notDone = targets.filter((q) => !correctTexts.has(q.text));
      if (notDone.length > 0) targets = notDone;
    }
    // 配列をシャッフル
    targets.forEach((_, i) => {
      let a = Math.trunc(Math.random() * (targets.length - i) + i);
      [targets[i], targets[a]] = [targets[a], targets[i]];
    });

    setSelectedKanji(targets[0] ?? null);
    setJudgments([]);
  }, [is1Grade, is2Grade, is3Grade, is4Grade, is5Grade, is6Grade, showOnlyNotDone, correctTexts]);

  const resetProgress = useCallback(() => {
    setCorrectTexts(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <Grid container direction="column" sx={sx}>
      <Grid container position="absolute" left={10} top={10} width={90} zIndex={1} gap={0.5}>
        <Button variant="outlined" component={Link} href="./" textAlign="center">
          九九
          <br />
          マスター
        </Button>
      </Grid>
      <Grid container position="absolute" right={10} top={10} width={74} zIndex={1} gap={0.5}>
        <Button onClick={randomSelect} variant="outlined" size="small">
          次の問題
        </Button>{" "}
        {correctCount > 0 && (
          <Button size="small" variant="outlined" color="error" onClick={resetProgress}>
            リセット
          </Button>
        )}
      </Grid>
      <Grid container className="TopPage" justifyContent="start" direction="column" gap={4}>
        <Grid container direction="column" alignItems="center" gap={2} mt={6}>
          <Typography variant="h5">漢字マスター</Typography>
          <Grid container gap={1}>
            <Button onClick={toggle1Grade} variant={is1Grade ? "contained" : "outlined"}>
              1 年生
            </Button>
            <Button onClick={toggle2Grade} variant={is2Grade ? "contained" : "outlined"}>
              2 年生
            </Button>
            <Button onClick={toggle3Grade} variant={is3Grade ? "contained" : "outlined"}>
              3 年生
            </Button>
          </Grid>
          <Grid container gap={1}>
            <Button onClick={toggle4Grade} variant={is4Grade ? "contained" : "outlined"}>
              4 年生
            </Button>
            <Button onClick={toggle5Grade} variant={is5Grade ? "contained" : "outlined"}>
              5 年生
            </Button>
            <Button onClick={toggle6Grade} variant={is6Grade ? "contained" : "outlined"}>
              6 年生
            </Button>
          </Grid>
          <Grid container alignItems="center" justifyContent="center" gap={2} flexWrap="wrap">
            <FormControlLabel
              control={<Checkbox checked={showOnlyNotDone} onChange={(e) => setShowOnlyNotDone(e.target.checked)} />}
              label="やったことない問題のみ"
            />
            {allTargets.length > 0 && (
              <Typography variant="body2">
                正解: {correctCount} / {allTargets.length} 問
              </Typography>
            )}
          </Grid>
        </Grid>
        <Button
          onClick={randomSelect}
          variant="contained"
          sx={{ alignSelf: "center", display: selectedKanji ? "none" : "block" }}
        >
          スタート
        </Button>
        <HandwritingCanvas onStrokesChange={setStrokeGroups} question={selectedKanji} judgments={judgments} />
        <Grid container justifyContent="center" alignItems="center" sx={{ display: selectedKanji ? "flex" : "none" }}>
          {/* 左スペーサー：判定ボタンを中央に保つ */}
          <Box sx={{ visibility: "hidden", pointerEvents: "none" }}>
            {judgments.length > 0 && <Button variant="outlined">次の問題へ</Button>}
          </Box>
          <Button
            variant="contained"
            onClick={recognize}
            disabled={!selectedKanji || strokeGroups.every((g) => g.length === 0) || isLoading}
            sx={{ mx: 2 }}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isLoading ? "判定中..." : "判定する"}
          </Button>
          {judgments.length > 0 && (
            <Button variant="outlined" onClick={randomSelect}>
              次の問題へ
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

const sx: SxProps = () => ({
  ".TopPage": {
    position: "relative",
    minHeight: "100dvh",
    overflowY: "auto",
    paddingBottom: "2rem",
  },
});
