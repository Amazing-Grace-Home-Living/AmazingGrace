import re

with open('dist/arcade/matrix-of-conscience/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("--- LINES WITH SCRIPT OR JS ---")
for i, line in enumerate(content.splitlines(), 1):
    if 'script' in line.lower() or '.js' in line.lower():
        print(f"{i}: {line}")
