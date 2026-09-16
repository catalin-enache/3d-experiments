import pygame
from pygame.locals import *
from OpenGL.GL import *
from OpenGL.GLU import *
from Cube import *
from LoadMesh import *
from Camera import *
import os


win_pos = (100, 100)
os.environ['SDL_VIDEO_WINDOW_POS'] = f"{win_pos[0]},{win_pos[1]}"


pygame.init()

# project settings
screen_width = 1000
screen_height = 800
background_color = (0, 0, 0, 1)
drawing_color = (1, 1, 1, 1)

screen = pygame.display.set_mode((screen_width, screen_height), DOUBLEBUF | OPENGL)
pygame.display.set_caption('OpenGL in Python')

mesh = LoadMesh("../objects/teapot.obj", draw_type=GL_LINE_LOOP)

camera = Camera()

def initialise():
    glClearColor(background_color[0], background_color[1], background_color[2], background_color[3])
    glColor(drawing_color)

    # projection
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()
    gluPerspective(60, (screen_width / screen_height), 0.1, 1000.0)

def camera_init():
    # modelview
    glMatrixMode(GL_MODELVIEW)
    glLoadIdentity()
    glViewport(0, 0, screen.get_width(), screen.get_height())
    glEnable(GL_DEPTH_TEST)
    camera.update(screen.get_width(), screen.get_height())

def draw_world_axes():
    glLineWidth(3)
    glBegin(GL_LINES)
    # X axis in red
    glColor3f(1, 0, 0)
    glVertex3f(0, 0, 0)
    glVertex3f(1000, 0, 0)
    # Y axis in green
    glColor3f(0, 1, 0)
    glVertex3f(0, 0, 0)
    glVertex3f(0, 1000, 0)
    # Z axis in blue
    glColor3f(0, 0, 1)
    glVertex3f(0, 0, 0)
    glVertex3f(0, 0, 1000)
    glEnd()

def reset_gl():
    glLineWidth(1)
    glColor3f(1, 1, 1)


def display():
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    camera_init()
    glPushMatrix()
    draw_world_axes()
    reset_gl()
    mesh.draw()
    glPopMatrix()


done = False
initialise()

while not done:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                pygame.mouse.set_visible(True)
                pygame.event.set_grab(False)
            elif event.key == pygame.K_SPACE:
                pygame.mouse.set_visible(False)
                pygame.event.set_grab(True)


    display()
    pygame.display.flip()
    pygame.time.wait(1)
pygame.quit()