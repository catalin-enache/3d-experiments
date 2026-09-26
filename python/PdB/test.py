import pygame
from OpenGL.GL import glGetString, GL_VERSION, GL_SHADING_LANGUAGE_VERSION

pygame.init()
pygame.display.gl_set_attribute(pygame.GL_CONTEXT_MAJOR_VERSION, 4)
pygame.display.gl_set_attribute(pygame.GL_CONTEXT_MINOR_VERSION, 1)
pygame.display.gl_set_attribute(
    pygame.GL_CONTEXT_PROFILE_MASK,
    pygame.GL_CONTEXT_PROFILE_CORE,
)
pygame.display.set_mode((1000, 800), pygame.OPENGL | pygame.DOUBLEBUF)

print("OpenGL:", glGetString(GL_VERSION))
print("GLSL:", glGetString(GL_SHADING_LANGUAGE_VERSION))