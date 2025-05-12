import { useEffect, useState } from "react";
import { getAllUsers } from "../service/user.service";
import { assignUserToCity, getAllCities } from "../service/city.service";
import { assignUserToVehicle, getAllVehicles } from "../service/vehicle.service";
import { useNavigate } from "react-router-dom";

export const SelectionPage = () => {
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isGamePossible, setIsGamePossible] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, citiesResponse, vehiclesResponse] = await Promise.all([
          getAllUsers(),
          getAllCities(),
          getAllVehicles()
        ]);
        
        setUsers(usersResponse.data || []);
        setCities(citiesResponse.data || []);
        
        const availableVehicles = vehiclesResponse.data || [];
        setVehicles(availableVehicles);
        
    
        const totalVehicleCount = availableVehicles.reduce((sum, vehicle) => sum + vehicle.count, 0);
        setIsGamePossible(totalVehicleCount > 0);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);


  const getAvailableVehicles = () => {
    if (!selectedCity) return [];
    
    const city = cities.find(city => city.id === parseInt(selectedCity));
    if (!city) return [];
    
    return vehicles.filter(vehicle => 
      vehicle.range >= city.distance*2 && 
      vehicle.count > 0
    );
  };

  const handleProceed = async () => {
    if (selectedUser && selectedCity && selectedVehicle) {
      try {
        await Promise.all([
          assignUserToVehicle({ bikeId: parseInt(selectedVehicle), userId: parseInt(selectedUser) }),
          assignUserToCity({ cityId: parseInt(selectedCity), userId: parseInt(selectedUser) })
        ]);
        navigate("/dashboard");
      } catch (error) {
        console.error("Assignment failed:", error);
        alert("Failed to proceed. Please try again.");
      }
    } else {
      alert("Please complete all selections!");
    }
  };

  // Styles
  const pageStyle = {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#2C3E50",
    minHeight: "100vh",
    color: "#ECF0F1",
    fontFamily: "'Press Start 2P', cursive"
  };

  const titleStyle = {
    textAlign: "center", 
    marginBottom: "30px", 
    fontSize: "36px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    color: "#3498DB"
  };

  const sectionStyle = {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "rgba(52, 73, 94, 0.7)",
    borderRadius: "15px"
  };

  const getCardStyle = (isSelected) => ({
    border: isSelected ? "3px solid #2ECC71" : "1px solid #34495E",
    borderRadius: "15px",
    padding: "16px",
    margin: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: isSelected ? "rgba(46, 204, 113, 0.2)" : "rgba(52, 73, 94, 0.5)",
    transform: isSelected ? "scale(1.05)" : "scale(1)",
    boxShadow: isSelected 
      ? "0 10px 20px rgba(0,0,0,0.3)" 
      : "0 4px 8px rgba(0,0,0,0.2)"
  });

  const noVehicleStyle = {
    padding: "20px", 
    backgroundColor: "rgba(231, 76, 60, 0.2)", 
    borderRadius: "15px", 
    color: "#E74C3C",
    textAlign: "center",
    margin: "20px auto",
    maxWidth: "600px"
  };

  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#3498DB",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "'Press Start 2P', cursive"
  };

  const restartButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#E74C3C",
    marginTop: "20px"
  };

  if (!isGamePossible) {
    return (
      <div style={pageStyle}>
        <div style={noVehicleStyle}>
          <h3>Game Over!</h3>
          <p>No vehicles are currently available to continue the game.</p>
          <button 
            style={restartButtonStyle}
            onClick={() => navigate("/")}
          >
            Restart Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Fugitive Hunt Game</h1>

      <section style={sectionStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Step 1: Select Your Investigator</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                setSelectedUser(user.id.toString());
                setSelectedCity(null);
                setSelectedVehicle(null);
              }}
              style={getCardStyle(selectedUser === user.id.toString())}
            >
              <img 
                src={user.avatar || "https://via.placeholder.com/150"}
                alt={user.name}
                style={{ 
                  width: "150px", 
                  height: "150px", 
                  objectFit: "cover", 
                  borderRadius: "50%", 
                  margin: "0 auto", 
                  display: "block",
                  border: "4px solid #3498DB"
                }}
              />
              <h3 style={{ margin: "15px 0 5px", textAlign: "center", color: "#ECF0F1" }}>{user.name}</h3>
            </div>
          ))}
        </div>
      </section>

     
      {selectedUser && (
        <section style={sectionStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Step 2: Choose Target City</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
            {cities.map((city) => {
              if(city.visited) return null;
              return(
              <div
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id.toString());
                  // Reset vehicle selection when city changes
                  setSelectedVehicle(null);
                }}
                style={getCardStyle(selectedCity === city.id.toString())}
              >
                <img
                  src={city.cityPhoto || "https://via.placeholder.com/150"}
                  alt={city.name}
                  style={{ 
                    width: "100%", 
                    height: "150px", 
                    objectFit: "cover", 
                    borderRadius: "10px",
                    border: "3px solid #2ECC71"
                  }}
                />
                <h3 style={{ margin: "15px 0 5px", color: "#ECF0F1" }}>{city.name}</h3>
                <p style={{ margin: "5px 0", color: "#BDC3C7" }}><strong>Distance:</strong> {city.distance} KM</p>
              </div>
            )
            })}
          </div>
        </section>
      )}


      {selectedCity && (
        <section style={sectionStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Step 3: Select Vehicle</h2>
          {getAvailableVehicles().length === 0 ? (
            <div style={noVehicleStyle}>
              <h3>No suitable vehicles available for this distance</h3>
              <p>Please select a different city or try again later.</p>
              <p>If not present then re-start game again</p>
                      <button onClick={()=>{navigate("/")}}>
                        Re-start
                      </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
              {getAvailableVehicles().map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id.toString())}
                  style={getCardStyle(selectedVehicle === vehicle.id.toString())}
                >
                  <img
                    src={vehicle.bikePhoto || "https://via.placeholder.com/150"}
                    alt={vehicle.name}
                    style={{ 
                      width: "100%", 
                      height: "150px", 
                      objectFit: "cover", 
                      borderRadius: "10px",
                      border: "3px solid #3498DB"
                    }}
                  />
                  <h3 style={{ margin: "15px 0 5px", color: "#ECF0F1" }}>{vehicle.name}</h3>
                  <p style={{ margin: "5px 0", color: "#BDC3C7" }}><strong>Range:</strong> {vehicle.range} KM</p>
                  <p style={{ margin: "5px 0", color: "#BDC3C7" }}><strong>Available:</strong> {vehicle.count}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}


      {selectedUser && selectedCity && selectedVehicle && (
        <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "30px" }}>
          <button 
            onClick={handleProceed}
            style={{
              ...buttonStyle,
              transform: "scale(1.05)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
            }}
          >
            Launch Investigation
          </button>
        </div>
      )}
    </div>
  );
};