<html>
<head>
</head>
<body>
  Bonjour Paris !
<?php
$uri = "";
require 'vendor/autoload.php'; // include Composer's autoloader

$client = new MongoDB\Client("mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn");
$collection = $client->demo->beers;

$result = $collection->insertOne( [ 'name' => 'Hinterland', 'brewery' => 'BrewDog' ] );

echo "Inserted with Object ID '{$result->getInsertedId()}'";
 ?>


</body>
</html>
