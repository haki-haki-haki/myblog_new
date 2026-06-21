# 数学公式与代码高亮

本博客支持数学公式渲染和代码高亮。

## 行内公式

爱因斯坦的质能方程：$E = mc^2$

勾股定理：$a^2 + b^2 = c^2$

## 块级公式

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

## 代码高亮

### Python

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fibonacci(10)))
# 输出: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### C

```c
#include <stdio.h>

int main() {
    printf("Hello, Blog!\n");
    return 0;
}
```

## 更多

之后还可以扩展支持 Mermaid 图表等更多功能。