from OpenGL.GL import *

def compile_shader(shader_type, shader_source):
    print("At compile time:")
    print("OpenGL:", glGetString(GL_VERSION))
    print("GLSL:", glGetString(GL_SHADING_LANGUAGE_VERSION))
    print("Shader source:", repr(shader_source[:100]))

    shader = glCreateShader(shader_type)
    glShaderSource(shader, shader_source)
    glCompileShader(shader)

    # Check for compilation errors
    compile_success = glGetShaderiv(shader, GL_COMPILE_STATUS)
    if not compile_success:
        error = glGetShaderInfoLog(shader).decode("utf-8")
        raise RuntimeError(f"Shader compilation failed: {error}")

    return shader

def create_program(vertex_shader_code, fragment_shader_code):
    vertex_shader = compile_shader(GL_VERTEX_SHADER, vertex_shader_code)
    fragment_shader = compile_shader(GL_FRAGMENT_SHADER, fragment_shader_code)

    program_id = glCreateProgram()
    glAttachShader(program_id, vertex_shader)
    glAttachShader(program_id, fragment_shader)
    glLinkProgram(program_id)

    # Check for linking errors
    link_success = glGetProgramiv(program_id, GL_LINK_STATUS)
    if not link_success:
        error = glGetProgramInfoLog(program_id).decode("utf-8")
        raise RuntimeError(f"Program linking failed: {error}")

    # Clean up shaders (they are no longer needed after linking)
    glDeleteShader(vertex_shader)
    glDeleteShader(fragment_shader)

    return program_id