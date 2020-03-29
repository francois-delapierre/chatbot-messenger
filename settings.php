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

$page_access_token = getenv('PAGE_ACCESS_TOKEN');


$curl = curl_init();
$url = "https://graph.facebook.com/v6.0/me/messages?access_token=".$page_access_token;
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, true);
$postfields = array(
    'persistent_menu' => array(
      'locale' => "default",
      'composer_input_disabled'=> 'false',
      'call_to_actions'=>array(
        'type'=>'postback',
        'title'=>'Bonjour',
        'payload'=>'HOLA'
      )
    )
);

$return = curl_exec($curl);
curl_close($curl);


if(isset($_POST['bouton1']))
{

}




    try {
      $mongo = new MongoDB\Client(
          'mongodb://heroku_4wq6mjkn:cnh4mlou3abk7sf9bbdcvbhvkk@ds037252.mlab.com:37252/heroku_4wq6mjkn?retryWrites=false');

     } catch (Exception $e) {
           echo $e->getMessage();
     }

 ?>


</body>
</html>
