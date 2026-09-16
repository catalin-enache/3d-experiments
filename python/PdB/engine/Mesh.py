from OpenGL.GL import *
import pygame


class Rotation:
    def __init__(self, angle=0, axis=pygame.math.Vector3(0, 0, 1)):
        self.angle = angle
        self.axis = axis


class Mesh:
    def __init__(self,
                 vertices=None,
                 triangles=None,
                 draw_type=GL_LINE_LOOP,
                 translation=pygame.math.Vector3(0, 0, 0),
                 rotation=Rotation(),
                 scale=pygame.math.Vector3(1, 1, 1)
                 ):
        self.vertices = vertices
        self.triangles = triangles
        self.draw_type = draw_type
        self.translation = translation
        self.rotation = rotation
        self.scale = scale

    def draw(self, move=pygame.math.Vector3(0, 0, 0)):
        glPushMatrix()
        glTranslatef(self.translation.x, self.translation.y, self.translation.z)
        glTranslatef(move.x, move.y, move.z)
        glRotatef(self.rotation.angle, self.rotation.axis.x, self.rotation.axis.y, self.rotation.axis.z)
        glScalef(self.scale.x, self.scale.y, self.scale.z)

        for t in range(0, len(self.triangles), 3):
            glBegin(self.draw_type)
            glVertex3fv(self.vertices[self.triangles[t]])
            glVertex3fv(self.vertices[self.triangles[t + 1]])
            glVertex3fv(self.vertices[self.triangles[t + 2]])
            glEnd()
        glPopMatrix()