export type Color = [number, number, number, number];

export interface Square {
  // position as a fraction of the canvas size
  x: number;
  y: number;
  // size in pixels
  size: number;
  // aspect of the square (1 = square, otherwise a rectangle)
  xScale: number;
  yScale: number;
  // radians per second
  rotationSpeed: number;
  color: Color;
  // squares orbiting around this one, inheriting its transform
  children: Square[];
}

export const squares: Square[] = [
  {
    x: 0.25,
    y: 0.3,
    size: 120,
    xScale: 1,
    yScale: 1,
    rotationSpeed: 0.5,
    color: [0.9, 0.3, 0.3, 1],
    children: [
      {
        x: 1,
        y: 0,
        size: 0.35,
        xScale: 1,
        yScale: 1,
        rotationSpeed: 2,
        color: [1, 0.8, 0.3, 1],
        children: []
      }
    ]
  },
  {
    x: 0.7,
    y: 0.3,
    size: 90,
    xScale: 2,
    yScale: 0.6,
    rotationSpeed: -0.8,
    color: [0.3, 0.8, 0.4, 1],
    children: [
      {
        x: 0.6,
        y: 0.8,
        size: 0.3,
        xScale: 1,
        yScale: 1,
        rotationSpeed: -3,
        color: [0.2, 0.5, 1, 1],
        children: []
      },
      {
        x: -0.6,
        y: -0.8,
        size: 0.3,
        xScale: 1,
        yScale: 1,
        rotationSpeed: 3,
        color: [0.8, 0.4, 1, 1],
        children: []
      }
    ]
  },
  {
    x: 0.5,
    y: 0.72,
    size: 150,
    xScale: 0.7,
    yScale: 1.3,
    rotationSpeed: 0.3,
    color: [0.3, 0.6, 0.9, 1],
    children: [
      {
        x: 0,
        y: 0.8,
        size: 0.4,
        xScale: 1,
        yScale: 1,
        rotationSpeed: -1.5,
        color: [0.9, 0.5, 0.2, 1],
        children: [
          {
            x: 1,
            y: 0,
            size: 0.4,
            xScale: 1,
            yScale: 1,
            rotationSpeed: 4,
            color: [1, 1, 1, 1],
            children: []
          }
        ]
      }
    ]
  }
];
