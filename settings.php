<html>
<head>
</head>
<body>
<div id="menu">
<a href="index.php">Statistiques</a> <a href="settings.php">Settings</a>
</div>


<?php
require 'vendor/autoload.php';

$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return str_repeat('Hello', getenv('PAGE_ACCESS_TOKEN'));
  echo getenv('PAGE_ACCESS_TOKEN');
});

    try {
      $mongo = new MongoDB\Client(
          'mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn?retryWrites=false');

     } catch (Exception $e) {
           echo $e->getMessage();
     }

 ?>


</body>
</html>
