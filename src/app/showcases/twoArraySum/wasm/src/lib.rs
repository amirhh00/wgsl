mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add_arrays(arr1: &[i32], arr2: &[i32]) -> Vec<i32> {
    let mut result = Vec::new();

    for i in 0..arr1.len() {
        result.push(arr1[i] + arr2[i]);
    }

    result
}
