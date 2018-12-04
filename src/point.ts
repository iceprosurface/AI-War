export declare interface IPoint {
  x: number;
  y: number;
}

export class Point implements IPoint {
  x: number;
  y: number;

  constructor(point: IPoint);
  constructor(x: number, y: number);
  constructor(xOrPoint: number | IPoint, y?: number) {
    if (y && typeof xOrPoint === "number") {
      this.x = xOrPoint;
      this.y = y;
    } else if (typeof xOrPoint !== "number") {
      this.x = xOrPoint.x;
      this.y = xOrPoint.y;
    }
  }
}
