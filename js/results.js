function displayResults(){
    console.log('display results');
    $("#mainContent").load("html/results.html", function(responseText, textStatus, XMLHttpRequest){
        if(textStatus=="success"){
            loadResults();
        }
        if(textStatus=="error"){
            $("#mainContent")[0].innerText="błąd wczytania strony wyników";
        }
    }); 
}

function loadResults(){
     getResults(function(results){
         console.log(results);
         fillResults(results);
     });
 }

 function procentStr(a, b){
    return parseInt((a*100)/b)+"% ("+a+")";
 }

 function procentInt(a,b){
     return parseFloat((a*100)/b);
 }

 function fillResults(results){

    var surveyCount = results["survey_count"];
     var receivedFormCounter = document.getElementById('receivedFormCounter');
    receivedFormCounter.innerHTML= surveyCount;

    var femaleCount = results["female_count"];
    var femaleCounter = document.getElementById('femaleCounter');
    var procent = procentStr(femaleCount, surveyCount);
    femaleCounter.style.width = procentInt(femaleCount,surveyCount)+"%";
    femaleCounter.innerHTML = procent;

    
    var maleCount = Math.abs(surveyCount - femaleCount);
    var maleCounter = document.getElementById('maleCounter');
    var procent = procentStr(maleCount, surveyCount);
    maleCounter.style.width = procentInt(maleCount,surveyCount)+"%";
    maleCounter.innerHTML = procent;

    var knowAboutVRCount = results["know_about_vr_count"];
    var knowAboutVRCounter = document.getElementById('knowAboutVRCounter');
    var procent = procentStr(knowAboutVRCount, surveyCount);
    knowAboutVRCounter.innerHTML = procent;

    
    var everUsedVRCount = results["ever_used_vr_count"];
    var everUsedVRCounter = document.getElementById('everUsedVRCounter');
    var procent = procentStr(everUsedVRCount, surveyCount);
    everUsedVRCounter.innerHTML = procent;

    var ageTable = document.getElementById("ageTable");
    results["age"].forEach(singleAgeStats => {

        var ageCell = document.createElement("th");
        var countCell = document.createElement("th");
        ageCell.innerHTML=singleAgeStats['age'];
        countCell.innerHTML = procentStr(singleAgeStats['count'],surveyCount);

        var row = document.createElement("tr");
        row.appendChild(ageCell);
        row.appendChild(countCell);

        var body = document.getElementById('ageTableBody');
        body.appendChild(row);
        


    });
    
    var usageFrequencyTable = document.getElementById("usageFrequencyTable");
    results["vr_usage_frequency"].forEach(singleFrequencyStats => {

        var frequencyNameCell = document.createElement("th");
        var countCell = document.createElement("th");
        var frequencyName;
        SURVEY_MODEL.find(question =>{
            question["answers"].find(answer =>{
                if(answer["id"] == singleFrequencyStats['vr_usage_frequency_id']){
                    frequencyName = answer["answer_text"];
                }
            });
        });

        frequencyNameCell.innerHTML = frequencyName;
        countCell.innerHTML = procentStr(singleFrequencyStats['count'], surveyCount);

        var row = document.createElement("tr");
        row.appendChild(frequencyNameCell);
        row.appendChild(countCell);

        var body = document.getElementById('usageFrequencyTableBody');
        body.appendChild(row);
        


    });
 }

