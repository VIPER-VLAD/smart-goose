<?php
	$config = [
		'recipients' => [
			'vlad.052898@gmail.com'
		],
		'email' => [
			'subject' => 'Новая заявка на звонок',
			'from' => 'notification@360.bi-group.org',
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
