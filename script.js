// date e variabili globali/api key
let api_Key ='iOM9Pa6tyniMbnuCWJksyfexbyEJLugShBgXnsZX';
let start = new Date;
let [startYear, startMonth, startDay, endYear, endMonth,endDay]=[start.getFullYear(),start.getMonth()+1,start.getDate(), start.getFullYear(),start.getMonth(),start.getDate()-12];


let end_date= startYear+'-'+startMonth+'-'+startDay;
let start_date= endYear+'-'+endMonth+'-'+endDay;
 let astronomyPictures= `https://api.nasa.gov/planetary/apod?start_date=${start_date}&end_date=${end_date}&api_key=${api_Key}&thumbs=true`;
  

let mainContainer = document.querySelector('#main-picture');

let picturesContainer = document.querySelector('.pictures-container')



// dichiarare l'api key e la stringa da fetchare

// manipolare dom per creare sezione immagine odierna
// fetchare le immagini

// funzione per fetchare le immagini,ritorno le immagini fetchate
let  fetchPictures = ()=>{
  let pictures = fetch(astronomyPictures)
  .then(res => {
     console.log(res)
   if(res.ok) {
      return res.json()} 
      else {
    throw new Error(res.status)
    }})
  
  .catch(
    error => {
      console.log(error);
      mainContainer.textContent = error;
    }
  )
  .finally(() => console.log('fine!'));
  
return pictures;
}
fetchPictures()

// dalle pictures chiamo la funzione per creare l'immagine principale

.then(
  pictures =>{
  createMainPicture(pictures.at(-1));
  createPreviouspictures(pictures.reverse().slice(1));
})

//  main picture
let createMainPicture =(picture)=>{
  mainContainer.innerHTML='';

let img = document.createElement('img');
 img.src = picture.url;
mainContainer.append(img);
console.log(picture);
let title = document.createElement('h3');
title.textContent = picture.title;
mainContainer.append(title);
let textContainer = document.createElement('div');
textContainer.classList.add('text-container');
let description = document.createElement('p');

description.textContent = picture.explanation;
mainContainer.append(textContainer);
textContainer.append(title);
textContainer.append(description);
}


// previous image
let createPreviouspictures = (pictures)=>{picturesContainer.innerHTML ='';
  pictures.map(picture=>{
                                                                  let pictureContainer= document.createElement('div');
                                                                  pictureContainer.classList.add('picture-container')
                                                                let img = document.createElement('img');
                                                                  img.src = picture.url;
                                                                  pictureContainer.append(img);
                                                                  picturesContainer.append(pictureContainer);
                                                                  pictureContainer.addEventListener('click',()=>{displayModal(picture)})
                                  
                  
                                       })}

function displayModal(picture){let modal = document.querySelector('#picture-details-container');
                                modal.style.display='flex';
                                let modaltitle= document.querySelector('#picture-title');
                                modaltitle.textContent= picture.title;
                                let img = document.querySelector('#picture-img');
                                img.src =picture.url;
                                let closebutton = document.querySelector('#close-button');
                                closebutton.addEventListener('click',()=>{modal.style.display='none';
                                    let description = document.querySelector('#picture-description');
                                  description.textContent = picture.explanation;
                                let copyright = document.querySelector('#picture-copyright');
                              copyright.textContent = picture.copyright})

                              }


                                                  






                                                    
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