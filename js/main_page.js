//survey loaded from database
var SURVEY_MODEL;

$(function(){

    //on load
    console.log('page loaded');
    
    displayForm();

    //menu
    var menu = $("input[name='menu']");
    menu.change(function(){
        var option = menu.filter(":checked").val();
        if(option == "form"){
            displayForm();
        } else if(option == "results"){
            displayResults();
        } else {
            console.log("Error: clicked menu option not recognized");
        }
    });
    

});



