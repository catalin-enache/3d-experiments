import math

import pygame
from pygame.locals import *
from OpenGL.GL import *
from OpenGL.GLU import *
import numpy as np
from lib.utils import *

pygame.init()

screen_width = 800
screen_height = 800
ortho_left = -400
ortho_right = 400
ortho_top = -400
ortho_bottom = 400

screen = pygame.display.set_mode((screen_width, screen_height), DOUBLEBUF | OPENGL)
pygame.display.set_caption('Turtle Graphics')

position = (0, 0)
direction = np.array([0, 1, 0])

def line_to(x, y):
    global position
    glBegin(GL_LINE_STRIP)
    glVertex2f(position[0], position[1])
    glVertex2f(x, y)
    # glVertex2f(current_position[0] + x, current_position[1] + y)
    glEnd()
    position = (x, y)


def move_to(x, y):
    global position
    position = (x, y)


def reset_turtle():
    global position
    global direction
    position = (0, 0)
    direction = np.array([0, 1, 0])


def draw_turtle():
    for i in range(20):
        forward(200)
        rotate(170)


def forward(draw_length):
    new_x = position[0] + direction[0] * draw_length
    new_y = position[1] + direction[1] * draw_length
    line_to(new_x, new_y)


def rotate(angle):
    global direction
    direction = z_rotation(direction, math.radians(angle))


def init_ortho():
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()
    gluOrtho2D(ortho_left, ortho_right, ortho_top, ortho_bottom)


init_ortho()
glLineWidth(5)

done = False
while not done:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glMatrixMode(GL_MODELVIEW)
    glLoadIdentity()
    glBegin(GL_POINTS)
    glVertex2f(0, 0)
    glEnd()

    reset_turtle()
    draw_turtle()

    pygame.display.flip()
pygame.quit()

