function validateIsNotEmpty(element, messageElement){
    if(element.value=="" || element.value===null){
        element.classList.add("is-invalid");
        messageElement.classList.add("text-danger");
        messageElement.innerHTML="Pole nie może być puste"
        return false;
    } else{
        element.classList.remove("is-invalid");
        messageElement.classList.remove("text-danger");
        messageElement.innerHTML="";

        return true; 
    }
}

function validateIsOnlyNumbers(element, messageElement){
    var regex = new RegExp("^([0-9]){1,}$");

    if(regex.test(element.value)){
        element.classList.remove("is-invalid");
        messageElement.classList.remove("text-danger");
        messageElement.innerHTML="";
        return true;
    } else{
        element.classList.add("is-invalid");
        messageElement.classList.add("text-danger");
        messageElement.innerHTML="Pole powinno zawierać tylko cyfry";
        return false;
    }
}

function validateInputAge(){
    console.log("validate \'wiek\'");

    var triggerElement = document.getElementById("inputAge");
    var messageElement = document.getElementById("inputAgeHelp");

    var val = triggerElement.value;
    var minAge = 1;
    var maxAge = 100;
    
    if(validateIsNotEmpty(triggerElement, messageElement)){
        if(validateIsOnlyNumbers(triggerElement, messageElement)){
            if(val>=minAge && val<=maxAge){
                triggerElement.classList.remove("is-invalid");
                messageElement.classList.remove("text-danger");
                messageElement.innerHTML="";
                return true;
            } else{
                triggerElement.classList.add("is-invalid");
                messageElement.classList.add("text-danger");
                messageElement.innerHTML="Wiek powinien mieścic się w zakresie 1-100";
                return false;
            } 
        } else return false;
    } else return false;
}

// function validateInputPeople(){
//     console.log("validate inputPeople on");
//     var triggerElement = document.getElementById("inputPeople");
//     var val = triggerElement.value;
//     var messageElement = document.getElementById("inputPeopleHelp");
//     if(validateIsNotEmpty(triggerElement, messageElement)){
//         if(validateIsOnlyNumbers(triggerElement, messageElement)){

//         }
//     }
// }

function validateQ8(){
    console.log("validate \'wprowadzam ograniczenia\'");

    var checkboxGroup = $('input[name=checkbox-group1]');
    var labels = checkboxGroup.map(function(){
        return $(this)[0].labels[0];
    });
    var messageElement = document.getElementById('q13Help');

    if(document.getElementById('q13Radio2').checked && checkboxGroup.filter(':checked').length == 0){
        labels.removeClass('btn-outline-info');
        labels.addClass('btn-outline-danger');
        messageElement.classList.add("text-danger");
        messageElement.innerHTML="Należy wybrać formę ograniczeń";
        return false;
    } else{
        messageElement.classList.remove("text-danger");
        messageElement.innerHTML="";
        labels.removeClass('btn-outline-danger');
        labels.addClass('btn-outline-info');
        return true;
    }
}

function validateForm(){
    console.log("validate form");
    var filledSurvey = new Array(SURVEY_MODEL.length);
    
    var messageElement = document.getElementById('submitHelp');
    if(validateInputAge()){
        if(!document.getElementById('q13').hidden){
            if(validateQ8()){
                messageElement.classList.remove("text-danger");
                messageElement.innerHTML="";        
                return true;
            }
        } else{
            messageElement.classList.remove("text-danger");
            messageElement.innerHTML="";        
            return true;
        }
    }

    messageElement.classList.add("text-danger");
    messageElement.innerHTML="Formularz został niepoprawnie wypełniony";    
    return false;
}