function connectdb(){
    var divResult = document.getElementById("databaseConnectionResult");
    
    $.get('../php/testConnection.php', function(data) {
        divResult.innerHTML=data;
        console.log("connection check ended with success<br/>");
    })
        .fail(function(jqXHR, textStatus, error) {
            divResult.innerHTML="connection check ended with error: "+error;
            console.log("connection check ended with error: "+error);
        })
        .always(function() {
            console.log("connection check finished");
        });
}

function getSurvey(callback){
    var divResult = $('#databaseConnectionResult');
    $.get('../php/get_survey.php', function(surveyJSON) {
        console.log("getting survey ended with success");
        callback(surveyJSON);
    }, "json")
        .fail(function(jqXHR, textStatus, error) {
            divResult.innerHTML="getting survey ended with error: "+error;
            console.log("getting survey ended with error: "+error);

        })
        .always(function() {
            console.log("getting survey finished");
        });

   
}
function sendSurvey(filledSurvey){
    var divResult = $('#databaseConnectionResult');
    $.post('../php/send_survey.php', { 'filledSurvey' : JSON.stringify(filledSurvey)}, function(result) {
        console.log(result);
        console.log("sending survey ended with success");
    })
        .fail(function(jqXHR, textStatus, error) {
            divResult.innerHTML="getting survey ended with error: "+error;
            console.log("sending survey ended with error: "+error);

        })
        .always(function() {
            console.log("sending survey finished");
        });
}

function getResults(callback){
    var divResult = document.getElementById("databaseConnectionResult");
    $.get('../php/get_results.php', function(resultsJSON) {
        console.log("getting results ended with success");
        callback(resultsJSON);
    }, "json")
        .fail(function(jqXHR, textStatus, error) {
            divResult.innerHTML="getting results ended with error: "+error;
            console.log("getting results ended with error: "+error);
        })
        .always(function() {
            console.log("getting results finished");
        });
   
}

function getSurveyTest(){
    var divResult = document.getElementById("databaseConnectionResult");
    
    $.get('../php/get_survey.php', function(surveyString) {
        //divResult.innerHTML=data;
        console.log("GET SURVEY TEST")
        console.log(surveyString);
        console.log("getting survey ended with success");
    })
        .fail(function(jqXHR, textStatus, error) {
            divResult.innerHTML="getting survey ended with error: "+error;
            console.log("getting survey ended with error: "+error);
        })
        .always(function() {
            console.log("getting survey finished");
        });
}

