import { useEffect, useState, useRef } from "react";
import { getAllUsers } from "../service/user.service";
import { getAllCities } from "../service/city.service";
import { getAllVehicles } from "../service/vehicle.service";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [cities, setCities] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [gameState, setGameState] = useState("");
    const [thiefCaptured, setThiefCaptured] = useState(false);
    const [thiefCity, setThiefCity] = useState(null);
    const navigate = useNavigate();
    const userMap = useRef(new Map());

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                const userData = response.data || [];
                setUsers(userData);

                const map = new Map();
                userData.forEach(user => map.set(user.id, user));
                userMap.current = map;

            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await getAllCities();
                const cityData = response.data || [];
                setCities(cityData);

                const foundThiefCity = cityData.find(city => city.thiefPresent);
               
                if ((foundThiefCity || thiefCaptured ) && foundThiefCity.visited) {
                    setThiefCaptured(true);
                    setThiefCity(foundThiefCity);
                }
                else{
                     setThiefCaptured(null)
                }
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await getAllVehicles();
                const vehicleData = response.data || [];
                setVehicles(vehicleData);

                let countAvailableVehicles = 0;
                vehicleData.forEach(vehicle => {
                    countAvailableVehicles += vehicle.count;
                });

                if (countAvailableVehicles === 0) {
                    setGameState("game Over");
                }
            } catch (error) {
                console.error("Failed to fetch vehicles:", error);
            }
        };
        fetchVehicles();
    }, []);

    // Styles
    const pageStyle = {
        fontFamily: "'Press Start 2P', cursive",
        backgroundColor: "#2C3E50",
        minHeight: "100vh",
        color: "#ECF0F1",
        padding: "20px",
        textAlign: "center"
    };

    const titleStyle = {
        fontSize: "36px",
        marginBottom: "30px",
        color: "#3498DB",
        textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
    };

    const cityCardStyle = (thiefPresent) => ({
        border: thiefPresent ? "3px solid #E74C3C" : "1px solid #34495E",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "15px",
        backgroundColor: thiefPresent ? "rgba(231, 76, 60, 0.2)" : "rgba(52, 73, 94, 0.5)",
        transition: "all 0.3s ease",
        transform: thiefPresent ? "scale(1.05)" : "scale(1)",
        boxShadow: thiefPresent 
            ? "0 10px 20px rgba(231, 76, 60, 0.4)" 
            : "0 4px 8px rgba(0,0,0,0.2)"
    });

    const buttonStyle = {
        padding: "15px 30px",
        fontSize: "18px",
        backgroundColor: thiefCaptured ? "#2ECC71" : "#E74C3C",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontFamily: "'Press Start 2P', cursive",
        marginTop: "20px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
    };

    const thiefImageContainerStyle = {
        marginTop: "30px",
        marginBottom: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(231, 76, 60, 0.3)",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
        animation: "pulse 2s infinite"
    };

    const thiefImageStyle = {
        maxWidth: "300px",
        borderRadius: "10px",
        border: "3px solid #E74C3C",
        marginBottom: "15px"
    };

    const captureMessageStyle = {
        fontSize: "24px",
        color: "#E74C3C",
        marginBottom: "10px",
        textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
    };

    return (
        <div style={pageStyle}>
            <h1 style={titleStyle}>Investigation Dashboard</h1>

            {thiefCaptured && (
                <div style={thiefImageContainerStyle}>
                    <h2 style={captureMessageStyle}>🚨 THIEF CAPTURED! 🚨</h2>
                    <img 
                        src="../../public/chor/chor.png" 
                        alt="Captured Thief" 
                        style={thiefImageStyle} 
                    />
                    <p style={{ color: "#ECF0F1", fontSize: "18px" }}>
                        Captured in: <strong>{thiefCity?.name || "Unknown Location"}</strong>
                    </p>
                </div>
            )}

            {cities.map((city) => {
                if (!city.visited) return null;

                const user = userMap.current.get(city.assignedUserId);

                return (
                    <div
                        key={city.id}
                        style={cityCardStyle(city.thiefPresent)}
                    >
                        <h3 style={{ color: "#3498DB", marginBottom: "10px" }}>{city.name}</h3>
                        <p style={{ color: "#BDC3C7" }}>
                            Assigned Investigator: {user ? user.name : "Unknown"}
                        </p>
                        <p style={{ 
                            color: city.thiefPresent ? "#E74C3C" : "#2ECC71", 
                            fontWeight: "bold" 
                        }}>
                            {city.thiefPresent 
                                ? "🚨 Thief Captured!" 
                                : "🕵️ Investigation Ongoing"}
                        </p>
                    </div>
                );
            })}

            <div style={{ marginTop: "30px" }}>
                <button 
                    onClick={() => {
                        if (gameState === "game Over") {
                            navigate("/");
                        } else {
                            navigate("/play-station");
                        }
                    }}
                    style={buttonStyle}
                >
                    {thiefCaptured 
                        ? "🎉 Mission Accomplished!" 
                        : (gameState === "game Over" 
                            ? "🚫 Game Over — Restart" 
                            : "🔍 Continue Investigation")}
                </button>
            </div>

            <style>
                {`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                    100% { transform: scale(1); }
                }
                `}
            </style>
        </div>
    );
};