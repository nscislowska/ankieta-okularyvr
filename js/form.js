function displayForm(){
    console.log('display form');
    
        $("#mainContent").load("html/form.html", function(responseText, textStatus, XMLHttpRequest){
            if(textStatus=="success"){
            insertFormEvents();
            loadSurvey();
            }
            else if(textStatus=="error"){
                $("#mainContent")[0].innerText="błąd wczytania strony formularza";
            }
        });
}

function loadSurvey(){
    getSurvey(function(surveyQueryResult){
        SURVEY_MODEL = surveyQueryResult;
        console.log(SURVEY_MODEL);
        fillForm();
    });

}

function fillForm(){
    var questionDivArr = document.getElementsByClassName("div-question");
    for(var questionIndex=0, divIndex=0; questionIndex<SURVEY_MODEL.length; questionIndex++, divIndex++){
        
        //display question
        var question = SURVEY_MODEL[questionIndex];
        var questionDiv = questionDivArr[divIndex];
        
        //if questionDiv holds a hardcoded question -> continue
        if(questionDiv.classList.contains("hardcoded-question")){
            questionIndex--;
            continue;
        }

        var questionLabel = questionDiv.getElementsByClassName("question-text")[0];
        questionLabel.innerHTML=/*(questionIndex+1)+". "+*/question["question_text"];

         // DISPLAY ANSWERS
         var answers = question["answers"];

         var inputGroup = $('input[name='+questionDiv.id+']');
                
         if(questionDiv.id == "q13"){
            //remove second radio, insert chekbox group
            inputGroup.splice(1, 1, ...$('input[name="checkbox-group1"]'));
        }
        //console.log(inputGroup);

        for(var answerIndex=0; answerIndex<answers.length; answerIndex++){
                var answer = answers[answerIndex];
                if (answer["answer_text"] == "") continue;
                var answerLabel = questionDiv.getElementsByClassName("label-answer")[answerIndex];
                answerLabel.firstChild.textContent=answer["answer_text"];
                inputGroup[answerIndex].value = answer["id"];
        }

        // console.log(inputGroup);
    }

}


function insertFormEvents(){

    $('#inputAge').on('input', function() {    
        validateInputAge();
    });

    $('#inputPeople').on('input', function() {
        validateInputPeople();
    });

    $('#q6YRadio').change(function(){
        disableQuestions(this, false, null, null); 
    });

    $('#q6NRadio').change(function(){
        disableQuestions(this, true, null, null); 
    });

    $('#q8YRadio').change(function(){
        disableQuestions(this, false, null, 4);
    });
    $('#q8NRadio').change(function(){
        disableQuestions(this, true, null, 4);
    });

    $('input[name=q13]').change(function(){
        validateQ8();
        $('.q13-label').removeClass("active");
        $(this)[0].labels[0].classList.add("active");
    });

    $('input[name=checkbox-group1]').change(function(){
        validateQ8();
        setActiveIfChecked($(this));            
    });

    $('.q13Radio').change(function(){
        uncheckCheckboxes($('input[name=checkbox-group1]'));
        disableCheckboxes($('input[name=checkbox-group1]'), true);

    });
    $('#q13Radio2').change(function(){
        disableCheckboxes($('input[name=checkbox-group1]'), false);
    });

    $('#submit').on('click', function(){
        if (validateForm() === true){
            var filledSurvey = getFilledSurvey();
            sendSurvey(filledSurvey);
            displayForm();
            alert("Dziękuję za wysłanie ankiety :)");
        }
    });
}

function disableQuestions(triggerElement, option, start, count){
    var questionDivArr = document.getElementsByClassName("div-question"); 

    if(start===null){
        //start below element that triggered function
        start = parseInt( triggerElement.name.substring(1) );
    }
    if(count === null){
        //hide all later questions
        count = questionDivArr.length-(start);
    }
   
    //'hidden'value for each questionDiv
    var hide = new Array(questionDivArr.length).fill(option); 
    
    for(var i=start; i<start+count; i++){
        
        //if q6 is shown, check whether show q7 and q8
        if(i==7 && hide[i]==false){
            var radioGroup = $("input[name=q"+(i+1)+"]");
            var checkedOptionId = radioGroup.filter(":checked")[0].id;
            if(checkedOptionId=="q8NRadio"){
                hide[i+1] = true;
                hide[i+2] = true;
                hide[i+3]=true;
                hide[i+4]=true;
            }
        }
        questionDivArr[i].hidden = hide[i];
    }
}

function disableCheckboxes(checkboxGroup, option){
    var labels = checkboxGroup.map(function(){
        return $(this)[0].labels[0];
    });

    if(option==true){
        checkboxGroup.attr("disabled", true);
        labels.addClass('btn-outline-secondary');
        labels.removeClass('btn-outline-info');
    } else {
        checkboxGroup.removeAttr("disabled");
        labels.removeClass('btn-outline-secondary');
        labels.addClass('btn-outline-info');
    }
}

function uncheckCheckboxes(checkboxGroup){    
    checkboxGroup.prop('checked',false);        
    checkboxGroup.each(function(){
        setActiveIfChecked($(this));
    });
}

function setActiveIfChecked(jQueryElement){
    if(jQueryElement.prop('checked')){
        jQueryElement[0].labels[0].classList.add("active");
    } else{
        jQueryElement[0].labels[0].classList.remove("active");
    } 
}

function getFilledSurvey(){
    var filledSurvey = new Array(SURVEY_MODEL.length);
    var questionDivArr = $(".div-question");

    for(var questionIndex=0, divIndex=0; questionIndex<SURVEY_MODEL.length; questionIndex++, divIndex++){
        //GET QUESTION

        var question = SURVEY_MODEL[questionIndex];
        var questionDiv = questionDivArr[divIndex];

        //if questionDiv holds a hardcoded question -> continue
        if(questionDiv.classList.contains("hardcoded-question")){
            questionIndex--;
            continue;
        }
        
         // GET CHECKED ANSWERS
         var answers = question["answers"];

        if(questionDiv.hidden == true){
            //save hidden question as unanswerd
            checkedAnswers = null;
        } else if (answers[0]["answer_text"] == ""){ 
            //if field is input save value and its id
           checkedAnswers = {
                "id": [answers[0].id],
                "answer_value": [questionDiv.getElementsByTagName('input')[0].value]
                };
        } else {
            //if field is radio or checkbox
            var inputGroup = $('input[name='+questionDiv.id+']');

            if(questionDiv.id == "q13"){
               inputGroup.splice(1, 1, ...$('input[name="checkbox-group1"]'));
           }

            var checkedAnswerId = inputGroup.filter(':checked')
                .map( function(){
                    return this.value;
                })
                .toArray();

            if(checkedAnswerId.length != 0 ){
                var checkedAnswers = {
                    "id" : checkedAnswerId
                }
            } else {
                checkedAnswers = null;
            }
        }

        var filledQuestion = {
            "id":question["id"],
            "answers":checkedAnswers
        }

        filledSurvey[questionIndex] = filledQuestion;  
    }
    console.log("filled survey",filledSurvey);
    return filledSurvey;
}
