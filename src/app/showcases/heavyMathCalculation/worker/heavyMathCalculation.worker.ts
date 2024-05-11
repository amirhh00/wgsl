const ctx: Worker = self as unknown as Worker;

type WData = {
  vector1: Float32Array;
  vector2: Float32Array;
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
 * this function will perform some heavy calculation
 * @param vector1
 * @param vector2
 * @returns {Float32Array}
 */
function addArray(vector1: Float32Array, vector2: Float32Array): Float32Array {
  const result = new Float32Array(vector1.length);
  for (let i = 0; i < vector1.length; i++) {
    // perform some heavy calculation
    result[i] = Math.sin(vector1[i]) * Math.cos(vector2[i]) + Math.sqrt(vector1[i] * vector2[i]);
  }
  return result;
}
