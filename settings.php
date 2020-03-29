<html>
<head>
</head>
<body>
<div id="menu">
<a href="index.php">Statistiques</a> <a href="settings.php">Settings</a>

<form method="post" action="settings.php">
  <input type="text" name="bouton1">
  <input type="text" name="bouton2">
  <input type="submit">
</form>

</div>


<?php
require 'vendor/autoload.php';


    try {
      $mongo = new MongoDB\Client(
          'mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn?retryWrites=false');

     } catch (Exception $e) {
           echo $e->getMessage();
     }

 ?>


</body>
</html>
