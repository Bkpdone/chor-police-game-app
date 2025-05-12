import { useNavigate } from "react-router-dom";
import { setThiefRandomly } from "../service/city.service";
import { useState } from "react";

export const StartPage = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  const reSetGame = async () => {
    await setThiefRandomly();
    navigate("/play-station");
  };

  const buttonStyle = {
    padding: "20px 40px",
    fontSize: "24px",
    fontWeight: "bold",
    backgroundColor: isHovering ? "#FF6B6B" : "#4ECDC4",
    color: "white",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    transform: isHovering ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovering 
      ? "0 10px 20px rgba(0,0,0,0.3)" 
      : "0 6px 12px rgba(0,0,0,0.2)",
    textTransform: "uppercase",
    letterSpacing: "2px",
    outline: "none",
    fontFamily: "'Press Start 2P', cursive"
  };

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#2C3E50",
    textAlign: "center",
    backgroundImage: "linear-gradient(to bottom right, #34495E, #2C3E50)",
  };

  const titleStyle = {
    fontSize: "48px",
    color: "#ECF0F1",
    marginBottom: "40px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    fontFamily: "'Press Start 2P', cursive",
    animation: "pulse 2s infinite"
  };

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
      <h1 style={titleStyle}>Fugitive Hunter</h1>
      <button 
        onClick={reSetGame}
        style={buttonStyle}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        Start Game
      </button>
    </div>
  );
};