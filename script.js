const ROWS = 20;
const COLS = 40;
let startNode = null;
let endNode = null;
let isMouseDown = false;
let isAnimating = false;



const gridElement = document.getElementById("grid");
gridElement.style.gridTemplateColumns = `repeat(${COLS}, 1.5rem)`;


function createNode(row, col) {
    return {
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
        element: null,
    };
}


const grid = [];

for (let row = 0; row < ROWS; row++) {
    const currentRow = [];

    for (let col = 0; col < COLS; col++) {
        const node = createNode(row, col);

        const cell = document.createElement("div");
        cell.className =
            "w-6 h-6 border border-gray-700 bg-gray-800 hover:bg-gray-600";

        node.element = cell;

        gridElement.appendChild(cell);
        currentRow.push(node);

        cell.addEventListener("mousedown", () => {
            isMouseDown = true;
            handleCellInteraction(node);
        });

        cell.addEventListener("mouseenter", () => {
            if (!isMouseDown) return;
            handleCellInteraction(node);
        });

        cell.addEventListener("mouseup", () => {
            isMouseDown = false;
        });

    }

    grid.push(currentRow);
}

document.body.addEventListener("mouseup", () => {
    isMouseDown = false;
})


function handleCellInteraction(node) {
    if (node.isVisited) return;
    if (isAnimating) return;
    // Start
    if (!startNode && !node.isEnd) {
        node.isStart = true;
        startNode = node;
        node.element.classList.add("bg-green-500");
        return;
    }

    // End
    if (!endNode && !node.isStart) {
        node.isEnd = true;
        endNode = node;
        node.element.classList.add("bg-red-500");
        return;
    }

    // Wall
    if (!node.isStart && !node.isEnd) {
        node.isWall = true;
        node.element.classList.add("bg-black");
    }
}


function getNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

    return neighbors;
}



function bfs(grid, startNode, endNode) {
    const visitedNodesInOrder = [];
    const queue = [];

    startNode.isVisited = true;
    queue.push(startNode);

    while (queue.length > 0) {
        const currentNode = queue.shift();
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) {
            break;
        }

        const neighbors = getNeighbors(currentNode, grid);

        for (const neighbor of neighbors) {
            if (neighbor.isVisited || neighbor.isWall) continue;

            neighbor.isVisited = true;
            neighbor.previousNode = currentNode;
            queue.push(neighbor);
        }
    }
    return visitedNodesInOrder;
}


function getShortestPath(endNode) {
    const path = [];
    let current = endNode;
    while (current !== null) {
        path.unshift(current);
        current = current.previousNode;
    }
    return path;
}


function animateBFS(visitedNodesInOrder, shortestPath) {
    isAnimating = true;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animateShortestPath(shortestPath);
                isAnimating = false;
            }, 20 * i);
            return;
        }

        setTimeout(() => {
            const node = visitedNodesInOrder[i];

            if (!node.isStart && !node.isEnd) {
                node.element.classList.add("bg-blue-500");
            }
        }, 20 * i);
    }
}


function animateShortestPath(path) {
    for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
            const node = path[i];
            if (!node.isStart && !node.isEnd) {
                node.element.classList.remove("bg-blue-500");
                node.element.classList.add("bg-yellow-400");
            }
        }, 40 * i);
    }
}



function resetVisitedState(grid) {
    for (const row of grid) {
        for (const node of row) {
            node.isVisited = false;
            node.previousNode = null;

            if (!node.isStart && !node.isEnd && !node.isWall) {
                node.element.classList.remove("bg-blue-500", "bg-yellow-400");
                node.element.classList.add("bg-gray-800");
            }
        }
    }
}

function resetDistances(grid) {
    for (const row of grid) {
        for (const node of row) {
            node.distance = Infinity;
            node.previousNode = null;
            node.isVisited = false;
            node.totalCost = Infinity;
        }
    }
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}






function dijkstra(grid, startNode, endNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;

    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length > 0) {
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) break;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === endNode) break;

        const neighbors = getNeighbors(closestNode, grid);
        for (const neighbor of neighbors) {
            if (neighbor.isVisited) continue;

            const newDistance = closestNode.distance + 1;
            if (newDistance < neighbor.distance) {
                neighbor.distance = newDistance;
                neighbor.previousNode = closestNode;
            }
        }
    }

    return visitedNodesInOrder;
}


function heuristic(node, endNode) {
    return Math.abs(node.row - endNode.row) +
        Math.abs(node.col - endNode.col);
}


function aStar(grid, startNode, endNode) {
    const visitedNodesInOrder = [];

    startNode.distance = 0;
    startNode.totalCost = heuristic(startNode, endNode);

    const openSet = getAllNodes(grid);

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.totalCost - b.totalCost);
        const currentNode = openSet.shift();

        if (currentNode.isWall) continue;
        if (currentNode.distance === Infinity) break;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) break;

        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (neighbor.isVisited) continue;

            const tentativeG = currentNode.distance + 1;

            if (tentativeG < neighbor.distance) {
                neighbor.distance = tentativeG;
                neighbor.totalCost =
                    tentativeG + heuristic(neighbor, endNode);
                neighbor.previousNode = currentNode;
            }
        }
    }

    return visitedNodesInOrder;
}


const algorithmSelect = document.getElementById("algorithmSelect");
const visualizeBtn = document.getElementById("visualizeBtn");
const clearPathBtn = document.getElementById("clearPathBtn");
const clearGridBtn = document.getElementById("clearGridBtn");




visualizeBtn.addEventListener("click", () => {
    if (isAnimating) return;

    if (!startNode || !endNode) {
        alert("Please place both start and end nodes.");
        return;
    }

    resetVisitedState(grid);
    resetDistances(grid);

    const algorithm = algorithmSelect.value;
    let visitedNodes;

    if (algorithm === "bfs") {
        visitedNodes = bfs(grid, startNode, endNode);
    } else if (algorithm === "dijkstra") {
        visitedNodes = dijkstra(grid, startNode, endNode);
    } else if (algorithm === "astar") {
        visitedNodes = aStar(grid, startNode, endNode);
    }

    const path = getShortestPath(endNode);
    animateBFS(visitedNodes, path);
});


clearPathBtn.addEventListener("click", () => {
    if (isAnimating) return;

    resetVisitedState(grid);
});


clearGridBtn.addEventListener("click", () => {
    if (isAnimating) return;

    startNode = null;
    endNode = null;

    for (const row of grid) {
        for (const node of row) {
            node.isStart = false;
            node.isEnd = false;
            node.isWall = false;
            node.isVisited = false;
            node.distance = Infinity;
            node.previousNode = null;
            node.totalCost = Infinity;

            node.element.className =
                "w-6 h-6 border border-gray-700 bg-gray-800 hover:bg-gray-600";
        }
    }
});



