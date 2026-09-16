from OpenGL.GL import *
from Mesh import *
import pygame

class LoadMesh(Mesh):

    def __init__(self, filename, draw_type=GL_LINE_LOOP, position=pygame.math.Vector3(0, 0, 0)):
        self.filename = filename
        vertices, triangles = self.load_drawing()
        super().__init__(
            vertices=vertices,
            triangles=triangles,
            draw_type=draw_type,
            translation=position,
            rotation=(0, 0, 0),
            scale=(1, 1, 1)
        )

    def load_drawing(self):
        vertices = []
        triangles = []
        with open(self.filename) as fp:
            line = fp.readline()
            while line:
                if line[:2] == "v ":
                    vx, vy, vz = [float(value) for value in line[2:].split()]
                    # print((vx, vy, vz))
                    vertices.append((vx, vy, vz))
                if line[:2] == "f ":
                    t1, t2, t3 = [value for value in line[2:].split()]
                    triangles.append([int(value) for value in t1.split('/')][0] - 1)
                    triangles.append([int(value) for value in t2.split('/')][0] - 1)
                    triangles.append([int(value) for value in t3.split('/')][0] - 1)
                line = fp.readline()
        return vertices, triangles
