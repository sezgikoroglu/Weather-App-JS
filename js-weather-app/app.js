var filter={
    elements:{
        buttonsDiv:document.querySelector("#city-buttons"),
        location:document.querySelector("#location"),
        detail:document.querySelector("#detail"),
        temp:document.querySelector("#temp"),
        humidity:document.querySelector("#humidity"),
        wind:document.querySelector("#wind"),
        realFeel:document.querySelector("#real-feel"),
        set:document.querySelector("#set"),
        rise:document.querySelector("#rise"),
        high:document.querySelector("#high"),
        low:document.querySelector("#low"),
        input:document.querySelector("#input-search"),
        mainDiv:document.querySelector("#main-div"),
        img:document.querySelector("#weather-img"),
        date:document.querySelector("#date-time")        
    },
    Apis:{
        base_url:"https://api.openweathermap.org/data/2.5",
        apiKey:"3dd18461380abd7a20d82715a57915ff",
        
    },
    status:{
        buttonsList:["paris","sydney","tokyo","toronto","berlin"],
        weather:{},
        city:"",
        unit:"",
        code:"",
        lat:"",
        lon:""

    },
    actions:{
        init:()=>{
            filter.actions.getButtonList()
            filter.status.unit="metric"
            filter.status.city="tokyo"
            filter.actions.getWeatherData(filter.status.city)
            filter.actions.getDate()
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  filter.status.lat = position.coords.latitude;
                  filter.status.lon = position.coords.longitude;
                });
            }
        },

        getDate:()=>{
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const date = new Date();
            let day_name = days[date.getDay()];
            let month = months[date.getMonth()];
            let day=date.getDate();
            let year=date.getFullYear();
            filter.elements.date.innerHTML=`${day_name} ${day} ${month} ${year}`    
        },
        getButtonList:()=>{
            filter.status.buttonsList.forEach((item,index)=>{
                var div=`<button class="text-white text-lg font-medium capitalize transition ease-out hover:scale-125" onclick=filter.actions.changeCity("${item}")>${item}</button>`
                filter.elements.buttonsDiv.innerHTML+=div
            })
        },

        changeCity:(city)=>{
            filter.status.city=city;
            filter.actions.getWeatherData()
        },

        handleInput:()=>{
            filter.status.city=filter.elements.input.value
            filter.actions.getWeatherData()
            filter.elements.input.value=""
        },

        handleLocationClick:() => {
            
            filter.status.city="";
            filter.actions.getWeatherData()
        },

        handleUnit:(nameUnit)=>{
            filter.status.unit=nameUnit;
            filter.actions.getWeatherData()
        },

        formatToLocalTime : (
            secs,
            zone,
            format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
        ) => luxon.DateTime.fromSeconds(secs).setZone(zone).toFormat(format),

        formatCurrentWeather:(data)=>{
            const {
                coord: { lat, lon },
                main: { temp, feels_like, temp_min, temp_max, humidity },
                name,
                dt,
                sys: { country, sunrise, sunset },
                weather,
                timezone,
                wind: { speed },
              } = data;
              const { main: details, icon } = weather[0];
              
              filter.elements.location.innerHTML=name + "  "+country;
              filter.elements.detail.innerHTML=details;
              filter.elements.humidity.innerHTML=humidity;
              filter.elements.realFeel.innerHTML=feels_like;
              filter.elements.wind.innerHTML=speed;
              filter.elements.high.innerHTML=temp_max;
              filter.elements.low.innerHTML=temp_min;
              filter.elements.set.innerHTML=filter.actions.formatToLocalTime(sunset, timezone, "hh:mm a");
              filter.elements.rise.innerHTML=filter.actions.formatToLocalTime(sunrise, timezone, "hh:mm a");
              
              if(filter.status.unit=="metric"){
                filter.elements.temp.innerHTML=temp+"°C"
                filter.elements.realFeel.innerHTML=feels_like+"°C";
              }else{
                filter.elements.temp.innerHTML=temp+"°F"
                filter.elements.realFeel.innerHTML=feels_like+"°F";
              }

              filter.elements.img.setAttribute("src",`http://openweathermap.org/img/wn/${icon}@2x.png`)
          
        },

        getWeatherData : () => {
            const url = new URL(filter.Apis.base_url  + "/weather");
            url.search = new URLSearchParams({ q:filter.status.city, appid: filter.Apis.apiKey,units:filter.status.unit });
            if (filter.status.city==""){
                url.search = new URLSearchParams({ lat:filter.status.lat,lon:filter.status.lon, appid: filter.Apis.apiKey,units:filter.status.unit });
            }else{
                url.search = new URLSearchParams({ q:filter.status.city, appid: filter.Apis.apiKey,units:filter.status.unit });
            }
            fetch(url)
            .then((res) => res.json())
            .then(filter.actions.formatCurrentWeather)
        }
          
    }

}

filter.actions.init()