## RUN

### Python 3.12.10

python -m venv .venv

source .venv/bin/activate

python -m pip install imgui-bundle numpy pygame PyOpenGL

python -m pip freeze > requirements.txt

python -m pip install -r requirements.txt

python -m pip install --upgrade -r requirements.txt
