<?php
	include "assets/Form.php";

	if($_SERVER['REQUEST_METHOD'] !== "POST"){
		http_response_code(404);
		die;
	}
	header('Content-Type: application/json');
	$data = $_POST;

	include "config.php";
	if($config['smtp']){
		include "assets/SMTP.php";
		$smtp = new SMTP($config);
		$form = new Form($config, $data, $smtp);
	}else{
		$form = new Form($config, $data);
	}

	echo $form->send();