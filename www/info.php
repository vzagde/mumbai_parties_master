<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
 <head>
  <title> New Document </title>
  <meta name="Generator" content="EditPlus">
  <meta name="Author" content="">
  <meta name="Keywords" content="">
  <meta name="Description" content="">
  
  
 </head>

 <body>

<script type="text/javascript">
    function showAndroidToast(toast) {

         toast = JSON.parse(toast);
         // Android.showToast(toast);
         
        alert(toast);
    }
</script>

 <?php

    echo "Your transaction is Success.";

    $arr['status'] = 'success';
    $arr['data'] = $_POST;

    $json =  json_encode($arr);
    
  ?>

  <input type="button" value="Close" onClick="showAndroidToast("<?php echo $json ?>")"/>




 </body>
</html>
