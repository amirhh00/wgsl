type WorkerRandomData = {
  digit: number;
};

(self as unknown as Worker).addEventListener("message", (e) => {
  const { digit } = e.data as WorkerRandomData;
  const vector1 = new Int32Array(digit);
  const vector2 = new Int32Array(digit);
  // generate random numbers
  for (let i = 0; i < digit; i++) {
    vector1[i] = Math.floor(Math.random() * 100);
    vector2[i] = Math.floor(Math.random() * 100);
  }
  (self as unknown as Worker).postMessage({ vector1, vector2 });
});
