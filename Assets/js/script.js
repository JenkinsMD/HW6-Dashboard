var searchInput = document.querySelector('.citySearch');
var searchBtn = document.querySelector('.searchbtn');
var form = document.querySelector('#form');
var currentField = document.querySelector('.currentField');
var fiveDay = document.querySelector('.fiveDay');
var cityListClass = document.querySelector('.cityList');
var holdCity = document.querySelector('.holdCity');
var selectCity = "";

var APIKey = "b49c68c493fab3115486e300bc9296da"

//Excample API Call
//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

var city= JSON.parse(localStorage.getItem('cityList')) || [];

//Call saved list on page load
updateCityList("onLoad");




//Saves value from form search
function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = searchInput.value;

 

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  
  updateCityList(searchInputVal);
   searchApi(searchInputVal);
   
  
}


form.addEventListener('submit', handleSearchFormSubmit);

//--------------------------------------------------------------
async function searchApi(query) {
  //Current Day
  var locQueryUrl = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q=';
  
  //5day Url
  var fiveDayUrl = 'https://api.openweathermap.org/data/2.5/onecall?units=imperial&exclude=minutely,hourly'



//Current day url
  locQueryUrl = locQueryUrl + query+'&appid=' + APIKey;
 

  //fetch current weather data
  const response = await fetch(locQueryUrl);
  const data = await response.json();


  currentCard(data);
  
  //Save coords to use in 5 day forecast
  const lat = data.coord.lat;
  const lon = data.coord.lon;

  
  //create the url for 5day forecast
  fiveDayUrl = fiveDayUrl + '&lat=' + lat + '&lon=' + lon + '&appid=' + APIKey;


  //fetch the 5day forecast data
  const responseFive = await fetch(fiveDayUrl);
  const dataFive = await responseFive.json();

  fiveDayForecast(dataFive);



  
}

function currentCard (data){

  currentField.innerHTML="";
  

  var li1=document.createElement("li");
  var li2=document.createElement("li");
  var li3=document.createElement("li");
  var li4=document.createElement("li");
  var li5=document.createElement("li");
  var li6=document.createElement("li");
  var ul=document.createElement("ul");


  ul.append(li1,li2,li3,li4,li5,li6)

  currentField.append(ul);

  li1.textContent= data.name;
  li2.textContent= moment(data.coord.dt).format("MM/DD/YYYY");
  li3.textContent= "https://openweathermap.org/img/w/"+data.weather[0].icon+".png";
  li4.textContent= "Temp: " +data.main.temp + "F";
  li5.textContent= "Humidity: " +data.main.humidity + "%";
  li6.textContent= "Windspeed: " + data.wind.speed + "mph";
 


}

//Prints next 5 day forecast to cards
function fiveDayForecast (dataFive){
  fiveDay.innerHTML="";
  console.log("In 5day");
  console.log(dataFive)

  for (i=1;i<6;i++) {

  var card=document.createElement("div");
  
  
  var li2=document.createElement("li");
  var li4=document.createElement("li");
  var li5=document.createElement("li");
  var li6=document.createElement("li");
  var ul=document.createElement("ul");


  ul.append(li2,li4,li5,li6)

  card.classList.add("dayCard")

  card.append(ul);
  fiveDay.append(card);


  li2.textContent= (moment.unix(dataFive.daily[i].dt).format("MM/DD/YYYY"));
  li4.textContent= "Temp: " +dataFive.daily[i].temp.day + "F";
  li5.textContent= "Humidity: " +dataFive.daily[i].humidity +"%";
  li6.textContent= "Windspeed: " + dataFive.daily[i].wind_speed + "mph";

  }

}

//Prints outs list of saved cities
function updateCityList(newCity){
  holdCity.innerHTML = "";
  var ul = document.createElement("ul");
  

  holdCity.append(ul)

    if(newCity==="onLoad"){

      console.log("loading page")

    } else if (!city.includes(newCity)) {

    city.push(newCity)

  } 

  for(j=0 ; j< city.length ; j++) {
    var btnLi = document.createElement("li");
    btnLi.classList.add("selectCity");
 
    btnLi.innerHTML = city[j];
  


    ul.append(btnLi);

  }

  selectCity = document.querySelector('.selectCity');

  localStorage.setItem('cityList', JSON.stringify(city));

}


//Search when a city in the side bar is clicked

function altSearch (event) {
event.stopPropagation();



var lookthisup = event.target.textContent;
searchApi(lookthisup);


}

//listen for city in side bar
holdCity.addEventListener('click', altSearch);