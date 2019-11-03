<?php
	$config = [
		'recipients' => [
			'myemail@gmail.com'
		],
		'email' => [
			'subject' => 'Новая заявка на звонок',
			'from' => 'info@site.com',
			'from_name' => '',
			'message_template' => "{$_SERVER['DOCUMENT_ROOT']}/smart-goose/email-template.html"
		],
		'smtp' => false,
		'smtp_host' => '',
		'smtp_port'  => 25,
		'smtp_username' => '',
		'smtp_password' => '',
		'smtp_charset' => 'UTF-8',
		'smtp_from' => ''
	];
