<?php
//echo "file exists: ";
//echo var_dump(file_exists('../php/classes/Connection.php'))."\n";
spl_autoload_register(function ($class)
 {
 include ('../php/classes/'.$class.'.php');
 });

 try{
	$conn = new Connection;
 } catch(Exception $e){
	print "Error!: " . $e->getMessage()."\n"; 
 }

	if($conn->open() == -1){
		return -1;
	} else {
        $filledSurvey = json_decode($_POST['filledSurvey'], true);

        // echo "filled survey:\n";print_r($filledSurvey);

        echo "json_decode status: ".json_last_error()." ("; // 4 (JSON_ERROR_SYNTAX)
        echo json_last_error_msg().")"; // unexpected character 

		(new Survey($conn))->sendSurvey($filledSurvey);

		$conn->close();
        $conn=null;
	}

?> 