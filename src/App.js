import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const numRows = 20;
const numCols = 20;
const cellSize = 20;

const App = () => {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  const handleKeydown = useCallback((e) => {
    if (isGameOver) {
      setSnake([{ x: 2, y: 2 }]);
      setFood({ x: 5, y: 5 });
      setDir({ x: 1, y: 0 });
      setIsGameOver(false);
      setScore(0);
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (dir.y === 0) setDir({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (dir.y === 0) setDir({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (dir.x === 0) setDir({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (dir.x === 0) setDir({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  }, [dir, isGameOver]);

  useEffect(() => {
    const handleGame = () => {
      const head = Object.assign({}, snake[0]);
      head.x += dir.x;
      head.y += dir.y;

      if (
        head.x < 0 ||
        head.x >= numCols ||
        head.y < 0 ||
        head.y >= numRows ||
        snake.some(part => part.x === head.x && part.y === head.y)
      ) {
        setIsGameOver(true);
        return;
      }

      const newSnake = [head, ...snake];
      newSnake.pop();

      if (head.x === food.x && head.y === food.y) {
        newSnake.push({});
        setFood({
          x: Math.floor(Math.random() * numCols),
          y: Math.floor(Math.random() * numRows)
        });
        setScore(prevScore => prevScore + 10);
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(handleGame, 100);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      clearInterval(gameInterval);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [snake, food, dir, handleKeydown]);

  useEffect(() => {
    if (isGameOver && score > highestScore) {
      setHighestScore(score);
    }
  }, [isGameOver, score, highestScore]);

  if (isGameOver) {
    return (
      <div className="App">
        <h2>Highest Score: {highestScore}</h2>
        <h1>You lost!</h1>
        <p>Press any arrow key or WASD to restart.</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h2>Highest Score: {highestScore}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`
        }}
      >
        {Array.from({ length: numRows * numCols }).map((_, index) => {
          const x = index % numCols;
          const y = Math.floor(index / numCols);
          const isSnakePart = snake.some(part => part.x === x && part.y === y);
          return (
            <div
              key={index}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: isSnakePart ? 'green' : food.x === x && food.y === y ? 'red' : 'lightgray',
                border: '1px solid white'
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
