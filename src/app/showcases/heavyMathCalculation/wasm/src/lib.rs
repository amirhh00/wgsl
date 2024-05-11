mod utils;

use std::f32;
use wasm_bindgen::prelude::*;

static mut RESULT_LEN: usize = 0;

#[wasm_bindgen]
pub extern "C" fn heavy_math(
    arr1: *const f32,
    len1: usize,
    arr2: *const f32,
    len2: usize,
) -> *const f32 {
    assert_eq!(len1, len2, "Vectors must be the same length");

    let arr1 = unsafe { std::slice::from_raw_parts(arr1, len1) };
    let arr2 = unsafe { std::slice::from_raw_parts(arr2, len2) };

    let mut result = Vec::new();

    for i in 0..len1 {
        result.push(f32::sin(arr1[i]) * f32::cos(arr2[i]) + f32::sqrt(arr1[i] * arr2[i]));
    }

    unsafe {
        RESULT_LEN = result.len();
    }

    let ptr = result.as_ptr();
    std::mem::forget(result);
    ptr
}

#[wasm_bindgen]
pub extern "C" fn get_result_len() -> usize {
    unsafe { RESULT_LEN }
}
