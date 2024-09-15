const calcContext: Worker = self as unknown as Worker;

type CData = {
  array: Uint32Array;
};

function sumArray(array: Uint32Array): number {
  return array.reduce((acc, cur) => acc + cur, 0);
}

calcContext.addEventListener("message", (e) => {
  const { array } = e.data as CData;
  const sum = sumArray(array);
  calcContext.postMessage({ sum });
});
