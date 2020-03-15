<html>
<head>
</head>
<body>
  Bonjour Paris !
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
          }

     } catch (Exception $e) {
           echo $e->getMessage();
     }




//$collection = $client->chatbot->notifications;

 ?>


</body>
</html>
