<html>
<head>
</head>
<body>
<div id="menu">
<a href="index.php">Statistiques</a> <a href="settings.php">Settings</a>
</div>


<?php
require 'vendor/autoload.php';



    try {
      $mongo = new MongoDB\Client(
          'mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn?retryWrites=false');

          $collection = $mongo->heroku_4wq6mjkn->users;

          $cursor = $collection->find(array("pays" => "SENEGAL"));;
          foreach ( $cursor as $id => $value )
          {
              echo "$id: ";
              var_dump( $value );
              echo $value['psid'];
          }

     } catch (Exception $e) {
           echo $e->getMessage();
     }




//$collection = $client->chatbot->notifications;

 ?>


</body>
</html>
