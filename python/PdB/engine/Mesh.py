from OpenGL.GL import *
import pygame

class Mesh:
    def __init__(self,
                 vertices=None,
                 triangles=None,
                 draw_type=GL_LINE_LOOP,
                 translation=(0, 0, 0),
                 rotation=(0, 0, 0),
                 scale=(1, 1, 1)
                 ):
        self.vertices = vertices
        self.triangles = triangles
        self.draw_type = draw_type
        self.translation = translation

    def draw(self, move=pygame.math.Vector3(0, 0, 0)):
        glPushMatrix()
        glTranslatef(self.translation[0], self.translation[1], self.translation[2])
        glTranslatef(move[0], move[1], move[2])
        for t in range(0, len(self.triangles), 3):
            glBegin(self.draw_type)
            glVertex3fv(self.vertices[self.triangles[t]])
            glVertex3fv(self.vertices[self.triangles[t + 1]])
            glVertex3fv(self.vertices[self.triangles[t + 2]])
            glEnd()
        glPopMatrix()