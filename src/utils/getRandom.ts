export const getRandom = (weights: Record<number, number>) => {
  // 重みの合計を計算
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  // 0からtotalWeightまでの乱数を生成
  const random = Math.random() * totalWeight;

  // 重みに基づいて数値を選択
  let currentWeight = 0;
  for (const [number, weight] of Object.entries(weights)) {
    currentWeight += weight;
    if (random < currentWeight) {
      return Number(number);
    }
  }

  // 万が一の場合のフォールバック
  return Number(Object.keys(weights)[0]);
}
