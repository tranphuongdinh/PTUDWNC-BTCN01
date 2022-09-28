export default function Square({ square, onClick, isActive }) {
    return (
        <button
            className={`square ${isActive ? "active" : ""}`}
            onClick={onClick}
        >
            {square.value}
        </button>
    );
}
