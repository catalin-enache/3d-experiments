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


points: list[tuple[int, int]] = []

def plot_points():
    glBegin(GL_POINTS)
    for p in points:
        px, py = (
            map_value(0, screen_width, 0, ortho_width, p[0]),
            map_value(0, screen_height, ortho_height, 0, p[1])
        )
        glVertex2f(px, py)
    glEnd()


done = False
init_ortho()
glPointSize(5)

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

    plot_points()

    pygame.display.flip()
    pygame.time.wait(100)
pygame.quit()
