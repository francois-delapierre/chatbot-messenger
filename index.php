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

 <?php
   # get the mongo db name out of the env
   $mongo_url = parse_url(getenv("MONGODB_URI"));
   $dbname = str_replace("/", "", $mongo_url["path"]);

   # connect
   $m   = new Mongo(getenv("MONGO_URL"));
   $db  = $m->$dbname;
   $col = $db->access;

   # insert a document
   $visit = array( "ip" => $_SERVER["HTTP_X_FORWARDED_FOR"] );
   $col->insert($visit);

   # print all existing documents
   $data = $col->find();
   foreach($data as $visit) {
     echo "<li>" . $visit["ip"] . "</li>";
   }

   # disconnect
   $m->close();
 ?>


</body>
</html>
