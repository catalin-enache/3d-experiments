import pygame
from OpenGL.GLU import *
from math import *

class Camera:
    def __init__(self, mouse_sensitivity=0.5, key_sensitivity=0.5):
        self.eye = pygame.math.Vector3(0, 0, 0)
        self.up = pygame.math.Vector3(0, 1, 0)
        self.right = pygame.math.Vector3(1, 0, 0)
        self.forward = pygame.math.Vector3(0, 0, 1)
        self.look = self.eye + self.forward
        self.yaw = -90
        self.pitch = 0
        self.last_mouse = pygame.math.Vector2(0, 0)
        self.mouse_sensitivity = mouse_sensitivity
        self.key_sensitivity = key_sensitivity

    def rotate(self, yaw, pitch):
        self.yaw += yaw
        self.pitch += pitch
        if self.pitch > 89.0:
            self.pitch = 89.0
        if self.pitch < -89.0:
            self.pitch = -89.0
        _pitch = radians(self.pitch)
        _yaw = radians(self.yaw)
        p = cos(_pitch) # projection of the forward vector on the XZ plane
        self.forward.x = cos(_yaw) * p
        self.forward.y = sin(_pitch)
        self.forward.z = sin(_yaw) * p
        self.forward = self.forward.normalize()
        self.right = self.forward.cross(pygame.math.Vector3(0, 1, 0)).normalize()
        self.up = self.right.cross(self.forward).normalize()

    def update(self, w, h):
        if pygame.mouse.get_visible():
            return
        mouse_pos = pygame.math.Vector2(pygame.mouse.get_pos())
        mouse_change = self.last_mouse - mouse_pos
        pygame.mouse.set_pos(w/2, h/2)
        self.last_mouse = pygame.math.Vector2(pygame.mouse.get_pos())

        self.rotate(
            -mouse_change.x * self.mouse_sensitivity,
            mouse_change.y * self.mouse_sensitivity
        )

        keys = pygame.key.get_pressed()
        if keys[pygame.K_s]:
            self.eye -= self.forward * self.key_sensitivity
        if keys[pygame.K_w]:
            self.eye += self.forward * self.key_sensitivity
        if keys[pygame.K_d]:
            self.eye += self.right * self.key_sensitivity
        if keys[pygame.K_a]:
            self.eye -= self.right * self.key_sensitivity
        if keys[pygame.K_e]:
            self.eye += self.up * self.key_sensitivity
        if keys[pygame.K_q]:
            self.eye -= self.up * self.key_sensitivity

        self.look = self.eye + self.forward
        gluLookAt(self.eye.x, self.eye.y, self.eye.z,
                  self.look.x, self.look.y, self.look.z,
                  self.up.x, self.up.y, self.up.z)