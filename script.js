let geocode = {
  reverseGeocode: function (latitude, longitude) {
    var apikey = "80a0a5c1c1db477e8567458eda7327ee";

    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      apikey +
      "&q=" +
      encodeURIComponent(latitude + "," + longitude) +
      "&pretty=1" +
      "&no_annotations=1";



    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      

      if (request.status == 200) {
  
        var data = JSON.parse(request.responseText);
        weather.fetchweather(data.results[0].components.city);
        console.log(data.results[0].components.city)
      } else if (request.status <= 500) {
      

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
    
      console.log("SERVER ERROR");
    };

    request.send(); 
  },
  getGeoLocation: function() {
    function success (data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    }
    else {
      weather.fetchWeather("Denver");
    }
  }
};

document.querySelector(".search button").addEventListener("click",function(){
  weather.search();
})

document.querySelector(".search-bar").addEventListener("keyup",function(event){
  if(event.key=="Enter")
  weather.search();
});

document.querySelector(".geolocation button").addEventListener("click", () =>{
    document.querySelector(".search-bar").value="";
    geocode.getGeoLocation();
  
});

let weather={
  fetchweather: function(city){
    fetch("https://weatherdbi.herokuapp.com/data/weather/"+city)
    .then((response)=>{
      
      if (!response.ok) {
        document.querySelector(".error").innerText="Please check the city name for getting weather details...";
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      
      return response.json();
      
    })
    .then((data)=>this.displayWeather(data)); 
   },

   displayWeather: function(data){
    if(data.code==0)
    {
      document.querySelector(".error").innerText="DOES NOT EXIST.CHECK CITY NAME";
     
    }
    if(data.code==1)
    {
      document.querySelector(".error").innerText="PLEASE ENTER VALID LOCATION";
     
    }
    if(data.code==2)
    {
      document.querySelector(".error").innerText="NOT AVAILABLE";
     
    }
  
    const { region }=data;
    const { dayhour,precip,humidity,comment,iconURL }=data.currentConditions;
    const { c }=data.currentConditions.temp;
    const { km }=data.currentConditions.wind;

    console.log(region,dayhour,c,precip,humidity,km,comment,iconURL);
    document.querySelector(".error-msg").innerText="";
    document.querySelector(".city").innerText="Weather in "+ region + " at "+dayhour;
    document.querySelector(".icon").src=iconURL;
    document.querySelector(".humidity").innerText="Humidity: "+humidity;
    document.querySelector(".wind").innerText="Wind Speed: "+km+" km/h";
    document.querySelector(".temp").innerText=c+"°C";
    document.querySelector(".description").innerText=comment;
    document.querySelector(".weather").classList.remove("loading");

    for(i=0;i<7;i++)
    { 
      document.querySelector(".weather_forecast_day"+(i+1)).innerText=data.next_days[i].day; 
      document.querySelector(".description"+(i+1)).innerText=data.next_days[i].comment;  
      document.querySelector(".day"+(i+1)+"max").innerText="Max: "+data.next_days[i].max_temp.c;  
      document.querySelector(".day"+(i+1)+"min").innerText="Min: "+data.next_days[i].min_temp.c;  
      document.querySelector(".weather_forecast_icon"+(i+1)).src=data.next_days[i].iconURL;  

    }


   },

   search: function(){
    this.fetchweather(document.querySelector(".search-bar").value);
   } 
   
};


function onError(error){
  
  document.querySelector(".error").innerText="ERROR FETCHING USER LOCATION"
  console.log(error.message);
}

geocode.getGeoLocation();


