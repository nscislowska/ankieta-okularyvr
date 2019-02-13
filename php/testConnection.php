<?php

echo "CONNECT TO DATABASE<br/>";

spl_autoload_register(function ($class)
 {
 include ('../php/classes/'.$class.'.php');
 });
 
 $conn = new Connection;
 
 if($conn->open() == -1 || $conn->PDO===NULL){
	echo "test failed<br/>";
 } else {
	 
    echo "Connected successfully<br/>";
    
    $conn->test();
	
	$conn->close();
 }


?> 