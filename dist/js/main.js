const saveData = async function(cityJSON){
    let cleanJSON = $(cityJSON).closest("figure").data("id");
    await tempraManager.saveCity(cleanJSON);
};

const removeData = async function(cityName){
    await tempraManager.removeCity($(cityName).closest("figure").data("name"));
};

const refreshData = async function(cityName){
    await tempraManager.updateCity($(cityName).closest("figure").data("name"));
};

const handleSearch = async function(){
    await tempraManager.getCityData(txtSearch.val());
    txtSearch.val("");
};

const handleSearchMyLocation = async function(position){
    if (position.coords.latitude === undefined){
        Notify.alert({
            title : 'Invalid Request',
            html : 'Failed to get your location!',
        });
    }
    else
        await tempraManager.getLatLonData(position.coords.latitude, position.coords.longitude);
};

const locationNotEnabled = function(){
    Notify.alert({
        title : 'Location Disabled',
        html : '<b>Location</b> is disabled by your browser.<br><br>Please enable it to use "My Location" feature.',
    });
};

const getLatLon = function(){
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(handleSearchMyLocation, locationNotEnabled);
    else{
        Notify.alert({
            title : 'Invalid Request',
            html : 'Geolocation is not supported by this browser!',
        });
    }
};

const addTempCityHelper = function(tempCity){
    if (tempCity.length !== 0){
        if (tempraManager.tempCityData.some(f => f.name === tempCity.name)){
            Notify.alert({
                title : 'Invalid Request',
                html : `<b>${tempCity.name}</b> is already exists!`,
            });
        }
        else{
            tempraManager.tempCityData.unshift(tempCity);
            renderer.renderData(tempraManager.cityData, content);
            renderer.renderData(tempraManager.tempCityData, tempContent);
        }
    }
    else
    {
        Notify.alert({
            title : 'Invalid Request',
            html : `Invalid location!`,
        });
    }
};

const loadPage = async function(){
    await tempraManager.getDataFromDB();
};

const txtSearch = $("#txt_search"),
    btnSearch = $("#btn_search"),
    btnMyLocation = $("#btn_my_location"),
    content = $(".content"),
    tempContent = $(".temp_content"),
    tempraManager = new TempraManager(),
    renderer = new Renderer();

btnSearch.on('click', handleSearch);
btnMyLocation.on('click', getLatLon);

loadPage();