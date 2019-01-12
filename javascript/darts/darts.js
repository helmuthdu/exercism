export const solve = (x, y) => {
  if (isNaN(x) || isNaN(y)) {
    return null;
  }

  const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

  if (dist <= 1) return 10;
  if (dist <= 5) return 5;
  if (dist <= 10) return 1;

  return 0;
};
