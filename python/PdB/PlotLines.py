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
ortho_width = 640
ortho_height = 480

screen = pygame.display.set_mode((screen_width, screen_height), DOUBLEBUF | OPENGL)
pygame.display.set_caption('Graphs in PyOpenGL')


def init_ortho():
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()
    gluOrtho2D(0, ortho_width, 0, ortho_height)


def point_map(p: tuple[float, float]) -> tuple[float, float]:
    return (
        map_value(0, screen_width, 0, ortho_width, p[0]),
        map_value(0, screen_height, ortho_height, 0, p[1])
    )


def plot_points():
    glBegin(GL_POINTS)
    for p in points:
        mp = point_map(p)
        glVertex2f(mp[0], mp[1])
    glEnd()


def plot_lines():
    # glBegin(GL_LINES)
    # glBegin(GL_LINE_LOOP)
    # glBegin(GL_LINE_STRIP)
    for line in points:
        glBegin(GL_LINE_STRIP)
        for p in line:
            mp = point_map(p)
            glVertex2f(mp[0], mp[1])
        glEnd()


done = False
init_ortho()
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

    plot_lines()

    pygame.display.flip()
    # pygame.time.wait(100)
pygame.quit()
