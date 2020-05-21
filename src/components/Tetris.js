import React, { useState } from 'react';

import { createStage, checkCollision } from '../gameHelpers';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
import {
  makeStyles,
  IconButton,
  Avatar,
  ListItem,
  Menu,
  List,
  Divider,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
  Paper,
  Toolbar,
  Tooltip
} from '@material-ui/core';
import {  GitHub as GitHubIcon } from '@material-ui/icons';
// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {

  const useStyles = makeStyles((theme) => ({
  small: {
    width: '60px',
    height: '60px',
    backgroundColor: 'white',
    marginLeft: '60px'
  },
 }));

  const classes = useStyles();

  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );

  console.log('re-render');

  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      // Activate the interval again when user releases down arrow.
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1));
      }
    }
  };

  const startGame = () => {
    // Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameOver(false);
  };

  const drop = () => {
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      // Also increase speed
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game over!
      if (player.pos.y < 1) {
        console.log('GAME OVER!!!');
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropPlayer = () => {
    // We don't need to run the interval when we use the arrow down to
    // move the tetromino downwards. So deactivate it for now.
    setDropTime(null);
    drop();
  };

  // This one starts the game
  // Custom hook by Dan Abramov
  useInterval(() => {
    drop();
  }, dropTime);

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      }
    }
  };

  return (

    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>

        <Stage stage={stage} />
        <aside>
        <h1 style={{color : 'white', fontFamily: 'Pixel', marginLeft: '20px'}}>   - Rottay -</h1>
        <p1 style={{color : 'white', fontFamily: 'Pixel', marginLeft: '20px'}}>Tetris Tutorial                   </p1>




          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>

              <Display text={`Score: ${score}`} />
              <Display text={`rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton callback={startGame} />
          <Tooltip title='Go to repository' placement='left' arrow>

          <IconButton
        aria-label='github'
        className={classes.small}
        href='https://github.com/davila23/react-tetris'
        target='_blank'
        rel='noopener'
      >
        <GitHubIcon />
      </IconButton>
      </Tooltip>

        </aside>
      </StyledTetris>



    </StyledTetrisWrapper>
  );

};

export default Tetris;
