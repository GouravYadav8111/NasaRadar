const url =
  "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY";
const feedContainer = document.querySelector(".feed-container");
const dateInput = document.querySelector("#dateInput");
const searchBtn = document.querySelector("#searchBtn");


const getAsteroids = async (dateValue) => {
    const selectedDate = dateValue ? dateValue:getCurrentDate();
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${selectedDate}&end_date=${selectedDate}&api_key=N1WVAlnUNGIG7DlYTC7QUY5cujgfVdhnXEYfzVx6`;


  try {


  let response = await fetch(url);
  let data = await response.json();
  
  let asteroids = data.near_earth_objects[selectedDate];
  console.log(`Found asteroids for ${selectedDate} : `, asteroids);

  displayAsteroids(asteroids);
  }catch(error){
    console.log("Error : ", error);
    
  }
};

searchBtn.addEventListener("click",() => {
const date = dateInput.value;
if(date){
    getAsteroids(date);
}
else{
    alert("Please select a date first! 📅");
}
});



const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const displayAsteroids = (asteroidsList) => {
    // asteroidsList is the element
    // 1. Clear previous results
    feedContainer.innerHTML = "";
    
    // 2. Loop through each asteroid
    asteroidsList.forEach((asteroid) => {
        // --- DATA EXTRACTION ---
        const name = asteroid.name;
    const id = asteroid.id;
    const isHazardous = asteroid.is_potentially_hazardous_asteroid;

    // Size (Diameter in KM)
    const size =
      asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2);

      // Speed & Distance are hidden in the "close_approach_data" array (usually index 0)
      const closeData = asteroid.close_approach_data[0];
      const speed = parseFloat(
          closeData.relative_velocity.kilometers_per_hour,
        ).toFixed(0);
        const distance = parseFloat(closeData.miss_distance.kilometers).toFixed(0);
        const date = closeData.close_approach_date_full;
        
    // --- VISUALS ---
    // Create the card div
    let div = document.createElement("div");
    div.classList.add("card");
    
    // If it is dangerous, add the red 'danger' class
    
    if (isHazardous) {
        div.classList.add("danger");
    }
    // Fill HTML
    div.innerHTML = `
    <h3>${name}</h3>
    <p><strong>⚠️ Hazardous:</strong> ${isHazardous ? "YES 🚨" : "No"}</p>
    <p><strong>📏 Size:</strong> ${size} km</p>
    <p><strong>🚀 Speed:</strong> ${speed} km/h</p>
    <p><strong>🌍 Distance:</strong> ${distance} km</p>
    <p><strong>📅 Time:</strong> ${date}</p>
    `;
    
    // Add to screen
    feedContainer.appendChild(div);
});
};

getAsteroids();