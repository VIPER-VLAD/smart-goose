<?php
class SMTP{
	private
		$username,
		$port,
		$host,
		$password,
		$charset,
		$from,
		$debug = false;

	public function __construct($config){
		$this->username = $config['smtp_username'];
		$this->port = $config['smtp_port'];
		$this->password = $config['smtp_password'];
		$this->charset = $config['smtp_charset'];
		$this->from = $config['smtp_from'];
	}


	public function smtpmail($mail_to, $subject, $message) {

		$SEND  = "Date: ".date("D, d M Y H:i:s") . " UT\r\n";
		$SEND .= 'Subject: =?' . $this->charset . '?B?'.base64_encode($subject)."=?=\r\n";

		$SEND .= "To: " . $mail_to . "\r\n";
		$SEND .= "Reply-To: " . $this->username . "\r\n";
		$SEND .= "Content-Type: text/html; charset=" . $this->charset . "\r\n";
		$SEND .= "From: " . $this->from . " <" . $this->username . ">\r\n";
		$SEND .= "X-Mailer: PHP/" . phpversion() . "\r\n\r\n";

		$SEND .=  $message."\r\n";

		if( !$socket = fsockopen($this->host, $this->port, $errno, $errstr, 30) ) {
			if ($this->debug) echo $errno."&lt;br&gt;".$errstr;
			return 'error';
		}

		if (!$this->server_parse($socket, "220", __LINE__)) return 'error';

		fputs($socket, "EHLO " . $this->host . "\r\n");
		if (!$this->server_parse($socket, "250", __LINE__)) {
			// if ($debug) echo 'error';
			fclose($socket);
			return 'error';
		}
		fputs($socket, "AUTH LOGIN\r\n");
		if (!$this->server_parse($socket, "334", __LINE__)) {
			fclose($socket);
			return 'error';
		}
		fputs($socket, base64_encode($this->username) . "\r\n");
		if (!$this->server_parse($socket, "334", __LINE__)) {
			fclose($socket);
			return 'error';
		}
		fputs($socket, base64_encode($this->passwort) . "\r\n");
		if (!$this->server_parse($socket, "235", __LINE__)) {
			fclose($socket);
			return 'error';
		}
		fputs($socket, "MAIL FROM: <".$this->username.">\r\n");
		if (!$this->server_parse($socket, "250", __LINE__)) {
			fclose($socket);
			return 'error';
		}
		fputs($socket, "RCPT TO: <" . $mail_to . ">\r\n");

		if (!$this->server_parse($socket, "250", __LINE__)) {
			fclose($socket);
			return 'error';
		}
		fputs($socket, "DATA\r\n");

		if (!$this->server_parse($socket, "354", __LINE__)) {
			fclose($socket);
			return 'error';
		}
		fputs($socket, $SEND."\r\n.\r\n");

		if (!$this->server_parse($socket, "250", __LINE__)) {
			fclose($socket);
			return 'error';
		}
		fputs($socket, "QUIT\r\n");
		fclose($socket);
		return 'success';
	}

	private function server_parse($socket, $response, $line = __LINE__) {
		$server_response = '';
		while (substr($server_response, 3, 1) != ' ') {
			if (!($server_response = fgets($socket, 256))) {
				return false;
			}
		}
		if (!(substr($server_response, 0, 3) == $response)) {
			return false;
		}
		return true;
	}
}