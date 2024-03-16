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

```svelte
<script>
    export let name = "Lucretius";
</script>

<p>Hello {name}</p>
```

Some inline code `:python:print("The random number is odd")` 