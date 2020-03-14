<html>
<head>
</head>
<body>
  Bonjour Paris !
<?php
$uri = "mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn";

/*
 * We recommend explictly configuring a connection timeout (see tips & tricks
 * below). Specify the replica set name to avoid connection errors.
 */
$options = array("connectTimeoutMS" => 30000, "replicaSet" => "replicaSetName");
$client = new MongoClient($uri, $options);

 ?>

mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn

</body>
</html>
