declare module 'js-cookie' {
  export function get(key: string): any | undefined;
  export function set(key: string, value: any | object, options?: object): void;
  export function remove(key: string, options?: any): void;
}
