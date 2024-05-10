//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

use mergearray::add_arrays;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn test_add_arrays() {
    let arr1 = vec![1, 2, 3];
    let arr2 = vec![4, 5, 6];
    let expected = vec![5, 7, 9];
    assert_eq!(add_arrays(&arr1, &arr2), expected);
}
