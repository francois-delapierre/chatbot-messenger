<html>
<head>
</head>
<body>
  Bonjour Paris !
<?php
require 'vendor/autoload.php';

$uri = "";

$client = new MongoDB\Client("mongodb+srv://francois-delapierre:EML2015fd%2E@cluster0-8iyqx.mongodb.net/test?retryWrites=true&w=majority");
$collection = $client->demo->beers;

$result = $collection->insertOne( [ 'name' => 'Hinterland', 'brewery' => 'BrewDog' ] );

echo "Inserted with Object ID '{$result->getInsertedId()}'";
 ?>


</body>
</html>
