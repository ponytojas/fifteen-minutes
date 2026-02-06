declare module "geokdbush" {
  import type KDBush from "kdbush";
  export function around(
    index: KDBush,
    longitude: number,
    latitude: number,
    maxResults?: number,
    maxDistance?: number,
    filterFn?: (id: number) => boolean,
  ): number[];
}
