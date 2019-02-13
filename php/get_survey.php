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
		$surveyArray = (new Survey($conn))->getSurvey();

		$conn->close();
		$conn=null;
	
		echo json_encode($surveyArray);
	}

?> 