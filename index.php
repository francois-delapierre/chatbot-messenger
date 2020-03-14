<html>
<head>
</head>
<body>
  Bonjour Paris !
<?php
require 'vendor/autoload.php';


$client = new MongoDB\Client(
    'mongodb+srv://francois-delapierre:EML2015fd.@cluster0-8iyqx.mongodb.net/test?retryWrites=true&w=majority');

$db = $client->test;

 ?>


</body>
</html>
