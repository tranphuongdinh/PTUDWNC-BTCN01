import React, { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";

const App = () => {
    const initSquares = (size) => {
        const squares = [];

        for (let i = 0; i < size; i++)
            for (let j = 0; j < size; j++)
                squares.push({
                    value: null,
                    row: i,
                    col: j,
                    isCauseWin: false,
                });

        return squares;
    };

    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [isAscMoves, setIsAscMoves] = useState(true);

    const [size, setSize] = useState(3);

    const [history, setHistory] = useState([
        {
            squares: initSquares(3),
            step: 0,
            activeRow: null,
            activeCol: null,
        },
    ]);

    const calculateWinner = (squares) => {
        if (squares.every((square) => square.value)) return "DRAW";

        // Hardcode for 3 consecutive squares
        if (squares.length === 9) {
            const lines = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];
            for (let i = 0; i < lines.length; i++) {
                const [a, b, c] = lines[i];
                if (
                    squares[a].value &&
                    squares[a].value === squares[b].value &&
                    squares[a].value === squares[c].value
                ) {
                    squares[a].isCauseWin = true;
                    squares[b].isCauseWin = true;
                    squares[c].isCauseWin = true;
                    return squares[a].value;
                }
            }
        }

        // Hardcode for 5 consecutive squares
        if (squares.length === 25) {
            const lines = [
                [0, 1, 2, 3, 4],
                [5, 6, 7, 8, 9],
                [10, 11, 12, 13, 14],
                [15, 16, 17, 18, 19],
                [20, 21, 22, 23, 24],
                [0, 5, 10, 15, 20],
                [1, 6, 11, 16, 21],
                [2, 7, 12, 17, 22],
                [3, 8, 13, 18, 23],
                [4, 9, 14, 19, 24],
                [0, 6, 12, 18, 24],
                [4, 8, 12, 16, 20],
            ];
            for (let i = 0; i < lines.length; i++) {
                const [a, b, c, d, e] = lines[i];
                if (
                    squares[a].value &&
                    squares[a].value === squares[b].value &&
                    squares[a].value === squares[c].value &&
                    squares[a].value === squares[d].value &&
                    squares[a].value === squares[e].value
                ) {
                    for (const index of lines[i]) {
                        squares[index].isCauseWin = true;
                    }
                    return squares[a].value;
                }
            }
        }

        return null;
    };

    const handleClick = (i, row, col) => {
        const choosenHistory = isAscMoves
            ? history.slice(0, stepNumber + 1)
            : [...history].reverse().slice(0, stepNumber + 1);

        const current = choosenHistory[choosenHistory.length - 1];
        const choosenSquares = current.squares.map((square) => ({ ...square }));

        if (calculateWinner(choosenSquares) || choosenSquares[i].value) {
            return;
        }

        if (!choosenSquares[i].value) {
            choosenSquares[i].value = xIsNext ? "X" : "O";
            setHistory(
                choosenHistory.concat([
                    {
                        squares: choosenSquares,
                        step: choosenHistory.length,
                        activeRow: row,
                        activeCol: col,
                    },
                ])
            );
            setStepNumber(choosenHistory.length);
            setXIsNext(!xIsNext);
        }
    };

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
    };

    const current =
        history[isAscMoves ? stepNumber : history.length - stepNumber - 1];

    const winner = calculateWinner(current.squares);

    let status;

    if (winner === "DRAW") status = "X and O draw";
    else if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    useEffect(() => {
        setHistory([
            {
                squares: initSquares(size),
                step: 0,
                activeRow: null,
                activeCol: null,
            },
        ]);
        setStepNumber(0);
        setXIsNext(true);
        setIsAscMoves(true);
    }, [size]);

    return (
        <div className="wrapper">
            <h1>THE GOMOKU GAME</h1>
            <div className="game">
                <div className="game-info">
                    <div>
                        Board size:{" "}
                        <select
                            name="size"
                            onChange={(e) => {
                                setSize(+e.target.value);
                            }}
                        >
                            <option value="3">3</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div style={{ marginTop: 10 }}>{status}</div>
                    <button
                        onClick={() => {
                            setIsAscMoves(!isAscMoves);
                        }}
                        className="sort-button"
                    >
                        Sort history by step:{" "}
                        {isAscMoves ? "Ascending" : "Descending"}
                    </button>
                </div>
                <div className="game-board">
                    <Board
                        current={current}
                        handleClick={(i, row, col) => handleClick(i, row, col)}
                        size={size}
                    />
                </div>
                <div className="game-history">
                    <ul className="history-list">
                        {history
                            .sort((h1, h2) =>
                                isAscMoves
                                    ? h1.step - h2.step
                                    : h2.step - h1.step
                            )
                            .map((his, index) => {
                                const desc = his.step
                                    ? "Go to move " +
                                      `#${his.step}` +
                                      ` (${his.activeCol}, ${his.activeRow})`
                                    : "Go to game start";

                                return (
                                    <li key={his.step}>
                                        <button
                                            onClick={() => jumpTo(his.step)}
                                            className={
                                                stepNumber === his.step
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            {desc}
                                        </button>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default App;
