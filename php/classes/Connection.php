<?php
//echo "file exists: ";
//echo var_dump(file_exists('classes/Constants.php'))."\n";

spl_autoload_register(function ($class)
 {
 include ('../php/classes/'.$class.'.php');
 });

class Connection extends Constants{
	
	private $PDO;
	
	public function open(){
		try{
			//if connection is closed, open new
			if ($this->PDO === null){
				$this->PDO = new PDO(
					'mysql:host='.self::DB_SERVERNAME.';dbname='.self::DB_NAME.";charset=utf8",
					self::DB_USERNAME, 
					self::DB_PASSWORD
				);
			}
		}catch (PDOException $e) {
			print "Error!: " . $e->getMessage() . "\n";
			return -1;
		}
		return 0;
	}
	
	public function close(){
		$this->$PDO = null;
	}
	
	public function __get($name){
        return $this->$name;
	}

	private function select($sql, $count){
		//execute query
		$stmt = $this->PDO->prepare($sql);
		$stmt->execute($param);
		
		if ($count === true) {
			$val = $stmt->fetchColumn();
			$stmt->fetchAll();
			return $val;
		} else {
			return $stmt->fetchAll();
		}
	}

	public function selectFromAnswer($answerModelId, $count){
		if($count === true) $sql = "SELECT COUNT(*) ";
		else $sql = "SELECT * ";
		$sql=$sql."FROM answer WHERE answer_model_id=".$answerModelId;
		return $this->select($sql, $count);		
	}
	
	public function selectAge(){
		$sql = "SELECT COUNT(id),answer_text FROM answer WHERE answer_model_id=3 GROUP BY answer_text ORDER BY COUNT(id) DESC";
		return $this->select($sql, false);
	}

	public function selectVRUsageFecuency(){
		$sql = "SELECT COUNT(id), answer_model_id FROM answer WHERE question_model_id=8 AND answer_model_id IS NOT NULL GROUP BY answer_model_id";
		return $this->select($sql, false);		
	}
	
	public function selectFilledSurveys($surveyId, $count){
		//prepare sql string
		$param = (array($surveyId));
		
		if($count === true) $sql = " SELECT COUNT(*) ";
		else $sql = " SELECT * ";
		
		$sql=$sql."FROM survey WHERE survey_model_id=".$surveyId;
		
		return $this->select($sql, $count);
	}

	public function selectQuestions($surveyId, $count){
		//prepare sql string
		$param = (array($surveyId));
		
		if($count) $sql = " SELECT COUNT(*) ";
		else $sql = " SELECT * ";
		
		$sql=$sql."FROM question_model WHERE survey_model_id=".$surveyId." ORDER BY record_number ASC";
		
		//execute query
		$stmt = $this->PDO->prepare($sql);
		//echo "sql :".$sql." stmt: ".$stmt->$queryString."\n";
		$stmt->execute($param);
		
		return $stmt->fetchAll();
	}
	
	public function selectAnswers($questionId, $count){
		//prepare sql string
		$param = (array($surveyId));
		
		if($count) $sql = " SELECT COUNT(*) ";
		else $sql = " SELECT * ";
		
		//$sql=$sql."FROM answer_model WHERE answer_model_node_id=".$answerNodeId." ORDER BY record_number ASC";
		$sql=$sql."FROM answer_model WHERE question_model_id=".$questionId." ORDER BY record_number ASC";
		
        //execute query
		$stmt = $this->PDO->prepare($sql);
		//echo "sql :".$sql." stmt: ".$stmt->$queryString."\n";
		$stmt->execute($param);
		
		return $stmt->fetchAll();
	}

	private function insert($stmt, $values){
		//echo"\nvalues\n";
		//print_r($values);
		//insert into
		try{
			$stmt->execute($values);
			$insertedRowCount = $stmt->rowCount();
			if($insertedRowCount == 0){
				echo "\ninsert ended with error: no data was inserted";
				return;
			} else {						
				echo "\ninsert ended with success";
				echo "\ninserted rows count: ".$insertedRowCount;
			}
		} catch (PDOException $e){
			echo "\nPDOException";
		} catch (Exception $e){
			echo "\ninsert ended with error:\n".$e;
		}

		return $this->PDO->lastInsertId();
	}

	public function insertSurvey($survey){

		echo "\ninsert into SURVEY";
		$surveyModelId = 1;

		$sql = "INSERT INTO survey (survey_model_id) VALUES (?)";
		$stmt = $this->PDO->prepare($sql);
		$values = [$surveyModelId];

		$surveyId = $this->insert($stmt, $values);

		//insert into table ANSWER 
		echo "\ninsert into ANSWER";

		$sql = "INSERT INTO answer (survey_id, question_model_id, answer_model_id,answer_text) VALUES (:surveyId, :questionModelId, :answerModelId, :answerText)";
		$stmt = $this->PDO->prepare($sql);
		
		foreach($survey as $index => $question) {

			$values = [
				'surveyId' => $surveyId,
				'questionModelId' => null,
				'answerModelId' => null,
				'answerText' => null
			];

			$answers = $question['answers'];
			$values['questionModelId'] = $question['id'];

			//assign answerText if exists
			if($answers['answer_value'] !== NULL){
				$values['answerText'] = $answers['answer_value'][0];
			}
			
			if($answers['id'] === NULL){
				$this->insert($stmt, $values);
			} else{
				foreach($answers['id'] as $index => $answerId){
					$values['answerModelId'] = $answerId;
					$this->insert($stmt, $values);
				}
			}
		}
	}

	
	
	
	public function test(){
		$sql = "SELECT * FROM user";
    $sqlC = "SELECT COUNT(*) FROM user";
    
    echo "test query: ".$sql."<br/>";
    echo "query result: ";
    
    //count result rows
    if ($result = $this->PDO->query($sqlC)) {
        
        //get result
        $result = $this->PDO->query($sql);
        // output data of each row
        foreach($result as $row) {
            echo "Username: " . $row["username"]. "\tEmail: " . $row["email"]. "\tPassword: " . $row["password"]. "<br/>";
        }
    } else {
        echo "0 results<br/>";
    }  
	}
	
}
?>