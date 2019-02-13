<?php
//echo "file exists: ";
//echo var_dump(file_exists('../php/classes/Connection.php'))."\n";

spl_autoload_register(function ($class)
 {
 include ('../php/classes/'.$class.'.php');
 });

 try{
    $conn = new Connection;
        

    if($conn->open() == -1){
		return -1;
	} else {
        // var_dump($conn);    
        // $res=new Results($conn);
        // var_dump($res);
        // $resultsArray = $res->getResults($conn);
        $results = (new Results($conn))->getResults($conn);

        $conn->close();
        $conn=null;
	
		echo json_encode($results);
    }
    
 } catch(Exception $e){
	print "Error!: " . $e->getMessage()."\n"; 
 }

	

?> 