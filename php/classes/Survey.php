<?php

spl_autoload_register(function ($class)
 {
 include ('../php/classes/'.$class.'.php');
 });
 
class Survey extends Constants{
	
	private $conn;
	
	public function __construct(Connection $conn){
		$this->conn = $conn;
	}
    
    private function getAnswers($questionId){

        $answers=[]; //contains output answers
        
        //get answers of single question in order
        
        $result = $this->conn->selectAnswers($questionId, false);
        
        foreach($result as $answer){
            //save single answer
            $answerArray=[
                self::ID => $answer[self::ID],
                self::ANSWER_TEXT => $answer[self::ANSWER_TEXT],
                // self::FIN => $answer[self::FIN],
                ];
                
            //add answer
            $answers[]=$answerArray;
        }
    
    return $answers;
    }

private function getQuestionWithAnswers($question){

    $questionArray=[
        //"record_number"=>$question["record_number"],
        self::ID => $question[self::ID],
        self::QUESTION_TEXT => $question[self::QUESTION_TEXT],
        
    ];

    $questionArray["answers"]=$this->getAnswers($question[self::ID]);
            
    return $questionArray;
}

	public function getSurvey(){
    
    $surveyArray = []; //returned survey model
   
    //count root questions in survey model with id=1 (the only existing)
	$questionsCount = $this->conn->selectQuestions(1, true);
    
    if ($questionsCount != 0) {
        
        //get root questions in order
		$questions = $this->conn->selectQuestions(1, false);
		
        foreach ($questions as $question){  
            $questionArray = []; //single question with its answers
            
            $questionArray = $this->getQuestionWithAnswers($question);
            $surveyArray[] = $questionArray;
        }
        
    } else {
       // echo "survey is empty";
    }

	return $surveyArray;
    }
    
    public function sendSurvey($filledSurvey){
        $this->conn->insertSurvey($filledSurvey);
    }

}



?> 