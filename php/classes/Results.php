<?php

spl_autoload_register(function ($class)
 {
 include ('../php/classes/'.$class.'.php');
 });
 
class Results extends Constants{
	
	private $conn;
	
	public function __construct(Connection $conn){
        $this->conn = $conn;
        //var_dump($this->$conn);
	}

	public function getResults($conn2){
    
    $results = [
        "survey_count" => null,
        "female_count" => null,
        "know_about_vr_count" => null,
        "ever_used_vr_count" => null,
        "age" => [],
        "vr_usage_frequency" =>null
    ];

    $results["survey_count"] = $conn2->selectFilledSurveys(1, true);
    $results["female_count"] = $conn2->selectFromAnswer(1, true);
    $results["know_about_vr_count"] = $conn2->selectFromAnswer(18, true);
    $results["ever_used_vr_count"] = $conn2->selectFromAnswer(25, true);

    $ageStats = $conn2->selectAge();
    foreach($ageStats as $index=>$singleAgeStats){
        $results['age'][] = [
            "age" => $singleAgeStats["answer_text"],
            "count" => $singleAgeStats["COUNT(id)"]
        ];
    }

    $VRUsageFrequencyStats = $conn2->selectVRUsageFecuency();
    foreach($VRUsageFrequencyStats as $index=>$singleVRUsageFrequencyStats){
        $results["vr_usage_frequency"][] = [
            "vr_usage_frequency_id" => $singleVRUsageFrequencyStats["answer_model_id"],
            "count" => $singleVRUsageFrequencyStats["COUNT(id)"]
        ];
    }

    
    //print_r($results);
    // //count root questions in survey model with id=1 (the only existing)
	// $questionsCount = $this->conn->selectQuestions(1, true);
    
    // if ($questionsCount != 0) {
        
    //     //get root questions in order
	// 	$questions = $this->conn->selectQuestions(1, false);
		
    //     foreach ($questions as $question){  
    //         $questionArray = []; //single question with its answers
            
    //         $questionArray = $this->getQuestionWithAnswersAndChildNodes($question);
    //         $surveyArray[] = $questionArray;
    //     }
        
    // } else {
    //    // echo "survey is empty";
    // }

	return $results;
	}
}

?> 