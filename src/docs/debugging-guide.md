# Galaga Game Debugging Guide

This guide provides solutions to common issues that might arise when running the refactored Galaga game.

## Common Runtime Errors and Solutions

### 1. "X is not a function" Errors

These errors typically occur when a function reference is missing or undefined. The most common instances are:

- **Entity state setters**: Make sure all entity state setters (`setEnemies`, `setBullets`, etc.) are properly exported from `useEntityState` and destructured in `useGameLoop`.

- **Callback functions**: Ensure callback functions in collision detection use the correct setter functions without `entityState.` prefix.

### 2. Dependency Array Issues

If you see warnings about missing dependencies in the useEffect dependency arrays:

- Make sure all variables used inside useEffect are included in the dependency array
- For functions that don't need to be recreated, define them outside the component or wrap them with useCallback

### 3. Component Rendering Issues

If game elements are not displaying correctly:

- Check the CSS classes and styles
- Verify that component props are passed correctly
- Ensure the game loop is updating entity positions

## Development Tips

### 1. Using Debug Mode

The game includes a debug mode that can be toggled by pressing the backtick key (\`). This displays:

- FPS count
- Entity counts
- Memory usage (if available)
- Frame time

This can help identify performance bottlenecks or unexpected entity behavior.

### 2. Step-by-step Debugging

For complex issues:

1. Temporarily disable the game loop to prevent continuous updates
2. Add console.log statements to track state changes
3. Use the React DevTools to inspect component props and state
4. Step through the game loop using browser developer tools

### 3. Common Performance Optimizations

If the game is running slowly:

- Reduce the number of particle effects
- Optimize collision detection by using spatial partitioning
- Use React.memo for components that don't need frequent re-renders
- Make sure explosion particles are removed when their lifespan is over
