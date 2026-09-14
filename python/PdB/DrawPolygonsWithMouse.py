import math
import numpy as np
import pygame
from pygame.locals import *
from OpenGL.GL import *
from OpenGL.GLU import *
from lib.utils import *

pygame.init()

screen_width = 1000
screen_height = 800

ortho_x1 = 0
ortho_x2 = 4
ortho_y1 = -1
ortho_y2 = 1

screen = pygame.display.set_mode((screen_width, screen_height), DOUBLEBUF | OPENGL)
pygame.display.set_caption('Graphs in PyOpenGL')


def init_ortho(x0, x1, y0, y1):
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()
    gluOrtho2D(x0, x1, y0, y1)


def point_map(p: tuple[float, float]) -> tuple[float, float]:
    return (
        map_value(0, screen_width, ortho_x1, ortho_x2, p[0]),
        map_value(0, screen_height, ortho_y2, ortho_y1, p[1])
    )


def draw_polygons():
    glColor(0.2, 0.2, 0.2, 1)
    # glBegin(GL_LINES)
    # glBegin(GL_LINE_LOOP)
    # glBegin(GL_LINE_STRIP)
    # glBegin(GL_POLYGON)

    # glBegin(GL_TRIANGLE_STRIP)
    # glBegin(GL_TRIANGLE_FAN)
    glBegin(GL_TRIANGLES)
    for p in points:
        mp = point_map(p)
        glVertex2f(mp[0], mp[1])
    glEnd()

    glColor(0.5, 0.5, 0.5, 1)
    # glBegin(GL_LINE_LOOP)
    # for p in points:
    #     mp = point_map(p)
    #     glVertex2f(mp[0], mp[1])
    # glEnd()
    for i in range(0, len(points) - 2, 3):
        mp1 = point_map(points[i])
        mp2 = point_map(points[i + 1])
        mp3 = point_map(points[i + 2])
        glBegin(GL_LINE_LOOP)
        glVertex2f(mp1[0], mp1[1])
        glVertex2f(mp2[0], mp2[1])
        glVertex2f(mp3[0], mp3[1])
        glEnd()






done = False
init_ortho(ortho_x1, ortho_x2, ortho_y1, ortho_y2)
glPointSize(5)
glLineWidth(3)

points: list[tuple[int, int]] = []
captured_mouse = False

while not done:
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glMatrixMode(GL_MODELVIEW)
    glLoadIdentity()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                done = True
        elif event.type == pygame.MOUSEBUTTONDOWN:
            p = pygame.mouse.get_pos()
            points.append(p)



    draw_polygons()

    pygame.display.flip()
    # pygame.time.wait(100)
pygame.quit()
