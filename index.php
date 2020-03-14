<html>
<head>
</head>
<body>
  Bonjour Paris !
<?php
require 'vendor/autoload.php';




    try {
      $mongo = new MongoDB\Client(
          'mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn');
           print_r($mongo->listDatabases());
     } catch (Exception $e) {
           echo $e->getMessage();
     }




//$collection = $client->chatbot->notifications;

 ?>


</body>
</html>
