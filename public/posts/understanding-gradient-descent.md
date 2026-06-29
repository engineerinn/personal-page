---
title: Understanding Gradient Descent
date: 2026-06-12
tags: [Machine Learning, Optimization]
excerpt: A quick, intuitive look at the workhorse optimization algorithm behind most of modern machine learning — with the core update rule and a tiny code example.
---

Gradient descent is the optimization algorithm behind most of modern machine learning. The idea is simple: to minimize a function, repeatedly take a small step in the direction that decreases it fastest — the negative gradient.

## The update rule

Given parameters $\theta$ and a loss function $J(\theta)$, each step updates the parameters as:

$$
\theta \leftarrow \theta - \eta \, \nabla_\theta J(\theta)
$$

where $\eta$ is the **learning rate**. Too large and the steps overshoot; too small and training crawls.

## A tiny example

Minimizing $f(x) = x^2$, whose gradient is $f'(x) = 2x$:

```python
x = 10.0          # starting point
lr = 0.1          # learning rate

for step in range(50):
    grad = 2 * x  # derivative of x**2
    x = x - lr * grad

print(x)          # -> approaches 0
```

Each iteration nudges `x` toward the minimum at $x = 0$. The same loop, scaled up to millions of parameters and a real loss surface, is what trains a neural network.

## Common variants

The plain version above uses the full dataset for every step. In practice you'll meet **stochastic** gradient descent (one sample at a time), **mini-batch** gradient descent (a small batch — the usual default), and adaptive methods like **Adam** that adjust the effective learning rate per parameter.
