class Renderer {
    constructor(){
    }

    renderData(cities, theContent){
        theContent.empty();
        if (cities.length !== 0){
            const template = Handlebars.compile($('#weatherAppData-template').html());
            theContent.append(template(cities));
        }
    }
}

Handlebars.registerHelper('toJSON', function(object){
    return new Handlebars.SafeString(JSON.stringify(object));
});