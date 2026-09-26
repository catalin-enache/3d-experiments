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


def draw_lines():
    # glBegin(GL_LINES)
    # glBegin(GL_LINE_LOOP)
    # glBegin(GL_LINE_STRIP)
    for line in points:
        glBegin(GL_LINE_STRIP)
        for p in line:
            mp = point_map(p)
            glVertex2f(mp[0], mp[1])
        glEnd()


def plot_graph():
    glBegin(GL_LINE_STRIP)
    for px in np.arange(0, 4, 0.005):
        py = math.exp(-px) * math.cos(2 * math.pi * px)
        glVertex2f(px, py)
    glEnd()


done = False
init_ortho(ortho_x1, ortho_x2, ortho_y1, ortho_y2)
glPointSize(5)

points: list[list[tuple[int, int]]] = []
line: list[tuple[int, int]] = []
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
            captured_mouse = True
            line = []
            points.append(line)
        elif event.type == pygame.MOUSEBUTTONUP:
            captured_mouse = False
        elif event.type == pygame.MOUSEMOTION and captured_mouse:
            p = pygame.mouse.get_pos()
            line.append(p)

    plot_graph()
    draw_lines()

    pygame.display.flip()
    # pygame.time.wait(100)
pygame.quit()
