import { enRuntimeMessages } from './en';

type DeepStringShape<T> = T extends string
  ? string
  : T extends readonly unknown[]
    ? { readonly [K in keyof T]: DeepStringShape<T[K]> }
    : T extends object
      ? { readonly [K in keyof T]: DeepStringShape<T[K]> }
      : T;

export type RuntimeMessages = DeepStringShape<typeof enRuntimeMessages>;
export type RuntimeMessageKey = keyof RuntimeMessages;
export type ToolRuntimeMessages<K extends RuntimeMessageKey> = RuntimeMessages[K];
