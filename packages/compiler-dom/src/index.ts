import { baseCompile } from "@vue/compiler-core";

export function compile(template: string, options) {
  return baseCompile(template, options)
}