<?php
class Form{
	private $config, $data, $smtp;

	public function __construct($config, $data, $smtp = false){
		$this->config = $config;
		$this->data = $data;
		$this->smtp = $smtp;
	}

	private function get_subject(){
		return $this->config['email']['subject'];
	}

	private function get_message(){
		ob_start();
		require($this->config['email']['message_template']);
		$message = ob_get_clean();

		foreach ($this->data as $name => $value){
			$message = str_replace("[:{$name}]", $value, $message);
		}

		return $message;
	}

	private function get_headers(){
		return 'From: ' . $this->config['email']['from_name'] . ' <' . $this->config['email']['from'] . ">\r\n" .
			'Reply-To: ' . $this->config['email']['from'] . "\r\n" .
			'Content-type: text/html; charset=utf-8'. "\r\n" .
			'X-Mailer: PHP/' . phpversion();
	}

	public function send(){
		$subject = $this->get_subject();
		$message = $this->get_message();
		$result = array(
			'status' => true
		);

		if($this->smtp){
			if(is_array($this->config['recipients'])){
				foreach ($this->config['recipients'] as $recipient)
					$this->smtp->smtpmail($recipient, $subject, $message);
			}else
				$this->smtp->smtpmail($this->config['recipients'], $subject, $message);
		}else{
			if(is_array($this->config['recipients'])){
				foreach ($this->config['recipients'] as $recipient){
					$headers = $this->get_headers($recipient);
					mail($recipient, $subject, $message, $headers);
				}
			}else{
				$headers = $this->get_headers($this->config['recipients']);
				mail($this->config['recipients'], $subject, $message, $headers);
			}
		}

		return json_encode($result);
	}
}

