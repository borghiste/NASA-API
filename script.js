// date e variabili globali/api key
let api_Key ='iOM9Pa6tyniMbnuCWJksyfexbyEJLugShBgXnsZX';
let api_Key2 ='sXypXBTu3UnfWhDfqZ6HKxVx2ckxgm4drQzfc2BB';
let start = new Date;
let [startYear, startMonth, startDay, endYear, endMonth,endDay]=[start.getFullYear(),start.getMonth()+1,start.getDate()-1, start.getFullYear(),start.getMonth()+1,start.getDate()-10];


let start_date= startYear+'-'+startMonth+'-'+startDay;
let end_date= endYear+'-'+endMonth+'-'+endDay;
let astronomyPictures= `https://api.nasa.gov/planetary/apod?start_date=${start_date}&end_date=${end_date}&api_key=${api_Key}`;
let astronomyPictures2 = `https://api.nasa.gov/planetary/apod?tart_date=${start_date}&end_date=${end_date}&api_key=DEMO_KEY`
console.log(end_date);
let mainContainer = document.getElementById('main-picture');

// settare le date per il l'api

// dichiarare l'api key e la stringa da fetchare

// manipolare dom per creare sezione immagine odierna
// fetchare le immagini

// funzione per fetchare le immagini,ritorno le immagini fetchate
let  fetchPictures = ()=>{
        let pictures =fetch(astronomyPictures)
      .then(res =>res.json())
      return pictures
}
let fetchedPicture =fetchPictures()
// dalle pictures chiamo la funzione per creare l'immagine principale
.then(pictures =>{createMainPicture(pictures.at(-1))
})

function createMainPicture(pictures){
let img = document.createElement('img')
 img.src = pictures.url;
mainContainer.append(img);
console.log(pictures);
}
// previous image


// google charts

// dati di curiosity
const curiosityData = 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json';


let fetchCuriosityData = () => {
  let data = fetch(curiosityData)
  .then(res => res.json())
  .then(data => data.soles)
  return data;
}

fetchCuriosityData()
  .then(
    res => {
      let marsWeatherData = [];
      let martianYear = 668;
      // Riempiamo un array
      for(let i=0; i < martianYear; i++) {
        marsWeatherData.push(res[i]);
      }
      return marsWeatherData;
    }
  )
  .then(data => {
    // console.log(data);
    let todayWeather = data[0];
    // console.log(today)
    document.querySelector('#mars-today').innerHTML = `
      <p>Hi from Curiosity!<br>
      This is my <strong>${todayWeather.sol}</strong> Martian day.<br>
      Today it's <strong>${todayWeather.atmo_opacity}</strong>, min temp is 
      <strong>${todayWeather.min_temp}°</strong> and max temp is 
      <strong>${todayWeather.max_temp}°</strong>.</p>
    `;

    // Step
    // caricare la chart di Google
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(() => {myChart(data)});
  });


let myChart = (weatherData) => {
  // console.log(weatherData);
  
  // formattare i dati
  // dall'array marsWeatherData prendiamo 3 proprietà: giorni, max e min temp.
  // [
  //   [1235, -75, 10],
  //   [1236, -55, 14],
  //   [1237, -35, 8],
  //   ...
  // ]
  // riempiamo la chart con i valori dell'array "pulito"
  let formattedData = weatherData.map(data => {
    return [data.sol, +data.min_temp, +data.max_temp];
  })
  
  var chartData = [
    ['Date', 'Min', 'Max']
  ];
  
  formattedData = formattedData.reverse();
  for(let data of formattedData) {
    chartData.push(data);
  }

  let options = {
    title: 'Mars Weather data',
    // curveType: 'function',
    hAxis: {
      title: 'Sols',
      titleTextStyle: {
        color: '#0000FF'
      }
    },
    vAxis: {
      title: 'Temp (Celsius)',
      ticks: [-80,-60,-40,-20,0,10]
    },
    legend: { 
      position: 'bottom' 
    }
  };

  let finalData = new google.visualization.arrayToDataTable(chartData);
 
  let chart = new google.visualization.LineChart(document.getElementById('mars-data'));
  chart.draw(finalData, options);
}