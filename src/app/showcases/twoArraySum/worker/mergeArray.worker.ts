const ctx: Worker = self as unknown as Worker;

type WData = {
  vector1: Int32Array;
  vector2: Int32Array;
};

ctx.addEventListener("message", (e) => {
  const { vector1, vector2 } = e.data as WData;

  const startTime = performance.now();
  const result = addArray(vector1, vector2);
  const endTime = performance.now();

  const duration = endTime - startTime;

  ctx.postMessage({ result, duration });
});

/**
 * this function will add two array and return the result
 * @param vector1
 * @param vector2
 * @returns {Int32Array}
 */
function addArray(vector1: Int32Array, vector2: Int32Array): Int32Array {
  const result = new Int32Array(vector1.length);
  for (let i = 0; i < vector1.length; i++) {
    result[i] = vector1[i] + vector2[i];
  }
  return result;
}
