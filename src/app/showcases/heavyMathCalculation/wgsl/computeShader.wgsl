// Define the compute shader in WGSL
@group(0) @binding(0) var<storage, read> array1 : array<f32>;
@group(0) @binding(1) var<storage, read> array2 : array<f32>;
@group(0) @binding(2) var<storage, read_write> resultArray : array<f32>;

// The workgroup size can be adjusted based on your needs and GPU capabilities
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let index : u32 = global_id.y * 65535u + global_id.x;
    // Ensure we do not access out of bounds
    if (index < arrayLength(&array1)) {
        let val1 : f32 = array1[index];
        let val2 : f32 = array2[index];
        // Perform some heavy computation
        let result : f32 = sin(val1) * cos(val2) + sqrt(val1 * val2);
        resultArray[index] = result;
    }
}
