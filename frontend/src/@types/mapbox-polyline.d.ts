declare module "@mapbox/polyline" {
  interface Polyline {
    decode(encoded: string, precision?: number): [number, number][];
    encode(coordinates: [number, number][], precision?: number): string;
  }

  const polyline: Polyline;
  export default polyline;
}
