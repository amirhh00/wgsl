/* tslint:disable */
/* eslint-disable */
/**
* @param {number} arr1
* @param {number} len1
* @param {number} arr2
* @param {number} len2
* @returns {number}
*/
export function heavy_math(arr1: number, len1: number, arr2: number, len2: number): number;
/**
* @returns {number}
*/
export function get_result_len(): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly heavy_math: (a: number, b: number, c: number, d: number) => number;
  readonly get_result_len: () => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
