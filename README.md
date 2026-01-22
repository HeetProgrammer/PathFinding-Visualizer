# Pathfinding Visualizer

## Overview

This project is an **interactive Pathfinding Visualizer** built using **HTML, Tailwind CSS, and Vanilla JavaScript**.
It visually demonstrates how different shortest-path algorithms explore a grid and find paths between two points.

The main goal of the project is to **understand and compare pathfinding algorithms**, not just implement them.


## Features

* Interactive grid (click & drag)
* Place **Start** and **End** nodes
* Draw **Walls**
* Visualize algorithms step by step
* Highlight the final shortest path
* UI controls for algorithm selection
* Clear path / clear grid functionality


## Algorithms Implemented

### 1. Breadth-First Search (BFS)

* Works on **unweighted graphs**
* Explores the grid **level by level**
* Guarantees the shortest path in terms of number of steps
* Uses a **queue**

**Key Idea:**
All moves have equal cost, so the first time BFS reaches the end, it has found the shortest path.


### 2. Dijkstra’s Algorithm

* Works on **weighted and unweighted graphs**
* Tracks the shortest distance from the start to every node
* Always expands the node with the **smallest known distance**
* Uses distance relaxation

**Key Idea:**
Once a node is marked visited, its shortest distance is finalized (weights must be non-negative).


### 3. A* (A-Star) Algorithm

* An optimization of Dijkstra’s algorithm
* Uses a **heuristic** to guide the search toward the goal
* Heuristic used: **Manhattan Distance**

```
f(n) = g(n) + h(n)
```

Where:

* `g(n)` = distance from the start
* `h(n)` = estimated distance to the end
* `f(n)` = total estimated cost

**Key Idea:**
A* explores fewer nodes than Dijkstra while still guaranteeing the shortest path (when the heuristic is admissible).


## Grid & Movement Rules

* Movement allowed only in **4 directions** (up, down, left, right)
* Each move has a cost of **1**
* Walls are non-traversable
* Grid is treated as a graph internally


## Visualization

* **Blue** → Visited nodes
* **Yellow** → Shortest path
* **Green** → Start node
* **Red** → End node
* **Black** → Walls

Animations are done using timed delays to show how algorithms explore the grid step by step.



## How to Run

1. Open `index.html` in a browser
2. Place **Start** and **End** nodes
3. Draw walls if needed
4. Select an algorithm
5. Click **Visualize**



