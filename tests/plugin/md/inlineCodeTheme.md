# Inline Code theme works

Main code block uses `dracula`

```python
import random

def generate_random_number():
    """Generate a random number between 1 and 100"""
    return random.randint(1, 100)

random_num = generate_random_number()
print(random_num)

if random_num % 2 == 0:
    print("The random number is even")
else:
    print("The random number is odd")
```

inline code blocks below won't use the theme above but will use `github-dark` & `monokai`
hello

`:python:print("The random number is odd")`
