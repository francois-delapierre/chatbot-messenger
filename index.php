<html>
<head>
</head>
<body>
  Bonjour Paris !
<?php
require 'vendor/autoload.php';




    try {
      $mongo = new MongoDB\Client(
          'mongodb+srv://francois-delapierre:JzRPE5Q9zyhvJE9U@cluster0-8iyqx.mongodb.net/test?retryWrites=true&w=majority');
           print_r($mongo->listDatabases());
     } catch (Exception $e) {
           echo $e->getMessage();
     }




//$collection = $client->chatbot->notifications;

 ?>


</body>
</html>
