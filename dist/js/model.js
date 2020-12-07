class TempraManager {
    constructor(){
        this.cityData = [];
        this.tempCityData = [];
    }

    getDataFromDB(){
        $.get('/cities', function(cities){
            if (cities.length !== 0){
                tempraManager.cityData.splice(0, tempraManager.cityData.length);
                cities.forEach(function(city){
                    city.updatedAt = moment(city.updatedAt).format("YYYY-MM-DD HH:mm");
                    tempraManager.cityData.push(city);
                });
                renderer.renderData(tempraManager.cityData, content);
            }
        });
    }

    getLatLonData(lat, lon){
        $.get(`/city/${lat}/${lon}`, function(city){
            addTempCityHelper(city);
        });
    }

    getCityData(cityName){
        $.get(`/city/${cityName}`, function(city){
            addTempCityHelper(city);
        });
    }

    saveCity(cityJSON){
        if (tempraManager.cityData.some(f => f.name === cityJSON.name)){
            Notify.alert({
                title : 'Invalid Request',
                html : `<b>${cityJSON.name}</b> is already exists!`,
            });
        }
        else{
            $.post('/city', cityJSON, function(city){
                if (city.length !== 0){
                    tempraManager.cityData.push(city);
                    const index = tempraManager.cityData.findIndex(c => c.name === cityJSON.name);
                    tempraManager.tempCityData.splice(index, 1);
                    renderer.renderData(tempraManager.cityData, content);
                    renderer.renderData(tempraManager.tempCityData, tempContent);
                    Notify.success({
                        title : `Added Weather Data`,
                        html : `<b>${city.name}</b> has been added to favorites.`,
                    });
                }
                else
                {
                    Notify.alert({
                        title : 'Invalid Action',
                        html : 'Try reloading this page.',
                    });
                }
            });
        }
    }

    removeCity(cityName){
        $.ajax({
            url: `/city/${cityName}`,
            type: 'DELETE',
            dataType: 'json',
            error: function(){
                Notify.alert({
                    title : 'Invalid Action',
                    html : 'Try reloading this page.',
                });
            },
            success: function(city){
                const index = tempraManager.cityData.findIndex(c => c.name === city.name);
                tempraManager.cityData.splice(index, 1);
                renderer.renderData(tempraManager.cityData, content);
                renderer.renderData(tempraManager.tempCityData, tempContent);
                Notify.success({
                    title : `Remove Weather Data`,
                    html : `<b>${city.name}</b> has been removed successfully.`,
                });
            }
        });
    }

    updateCity(cityName){
        $.ajax({
            url: `/city/${cityName}`,
            type: 'PUT',
            dataType: 'json',
            error: function(){
                Notify.alert({
                    title : 'Invalid Action',
                    html : 'Try reloading this page.',
                });
            },
            success: function(city){
                let index = tempraManager.cityData.findIndex(c => c.name === cityName);
                if (index !== -1){
                    tempraManager.cityData[index] = city;
                    tempraManager.cityData[index].updatedAt = moment(tempraManager.cityData[index].updatedAt).format("YYYY-MM-DD HH:mm");
                    renderer.renderData(tempraManager.cityData, content);
                }
                else{
                    index = tempraManager.tempCityData.findIndex(c => c.name === cityName);
                    tempraManager.tempCityData[index] = city;
                    tempraManager.tempCityData[index].updatedAt = moment(tempraManager.tempCityData[index].updatedAt).format("YYYY-MM-DD HH:mm");
                    renderer.renderData(tempraManager.tempCityData, tempContent);
                }
                Notify.success({
                    title : `Refresh Weather Data`,
                    html : `<b>${city.name}</b> has been updated successfully.`,
                });
            }
        });
    }
}