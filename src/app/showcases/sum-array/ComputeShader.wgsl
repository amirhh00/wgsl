@group(0) @binding(0) var<storage, read> input_array: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: atomic<u32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    if (index >= arrayLength(&input_array)) {
        return;
    }

    let value = input_array[index];
    atomicAdd(&output, bitcast<u32>(value));
}