var smart_goose = {
		files: {
			popup: "/smart-goose/smart-goose-popup.html",
			css: [
				"/smart-goose/css/smart-goose.min.css"
			],
			js: [
				"/smart-goose/js/libs/jquery.inputmask.min.js"
			]
		},
		handler: "/smart-goose/php/handler.php",
		handler_errors: {
			other: "При отправке произошла ошибка. Попробуйте позже или обратитесь к администрации сайта"
		},
		popup_settings: {
			title                    : "Получить консультацию",
			button_send_text         : "Отправить",
			button_waiting_text      : "Отправка...",
			thanks_title             : "Заявка отправлена",
			thanks_text              : "<p>Наш менеджер свяжется с Вами в ближайшее время</p>",
			selector                 : '#smart-goose-popup',
			container_selector       : '.smart-goose-popup__container',
			error_form_selector      : '.smart-goose-popup__form-error-block',
			form_selector            : '.smart-goose-popup__form',
			thanks_selector          : '.smart-goose-popup__thanks',
			thanks_title_selector    : '.smart-goose-popup__thanks__title',
			thanks_text_selector     : '.smart-goose-popup__thanks__text',
			title_selector           : '.smart-goose-popup__title',
			show_class               : 'show',
			error_block_show_duration: 7000,
			phone: {
				masking         : true,
				mask            : "+7 (999) 999-9999",
				valid_length    : 8,
				mask_placeholder: "_",
				require         : true,
				name            : 'phone'
			}
		},
		errors: {
			1 : "Error for the error code not found",
			2 : "The Smart Goose needs jQuery library. \nAdd <script src=\"https://code.jquery.com/jquery-3.4.1.min.js\"></script> in head OR include Smart Goose after jQuery.",
			3 : "Alert message not found",
			4 : "An error occurred while loading popup HTML. Check the link.",
			5 : "Popup file specified.",
			6 : "CSS files specified.",
			7 : "JS files specified.",
			8 : "An error occurred while loading CSS file. Check the link.",
			9 : "An error occurred while loading JS file. Check the link.",
			10: "Include jQuery Inputmask \nRead more: https://plugins.jquery.com/jquery.inputmask/.",
		},
		validate_errors: {
			phone: "Номер телефона введен неверно"
		},
		alerts: {
			'reload': 'Произошла ошибка загрузки скрипта. Попробуйте перезагрузить страницу'
		},
		show_popup: function(){
			$(this.popup_settings.selector)
				.addClass(this.popup_settings.show_class);
		},
		hide_popup: function(){
			$(this.popup_settings.selector)
				.removeClass(this.popup_settings.show_class);
		},
		load_popup: function(){
			if(!this.files.popup){
				this.show_console_error(5);
			}else{
				$.ajax({
					type: "GET",
					url: this.files.popup,
					dataType: "html",
					success: smart_goose.loaded_popup,
					error: function (response) {
						smart_goose.show_alert('reload');
						smart_goose.show_console_error(4);
						console.error(response);
					}
				});
			}
		},
		loaded_popup: function(response){
			smart_goose.inner_html(response);
			smart_goose.bind_keyup();
			smart_goose.bind_mousedown();
			smart_goose.inner_configs_popup();
			setTimeout(function () {
				if(smart_goose.popup_settings.phone.masking)
					smart_goose.mask_input_phone();
			}, 400);
		},
		load_css: function(){
			if(!this.files.css){
				this.show_console_error(6);
			}else{
				$.each(this.files.css, function (index, css) {
					var html = $('<link>', {
						'rel': "stylesheet",
						'href': css
					});
					smart_goose.inner_html(html);
				});
			}
		},
		load_js: function(){
			if(!this.files.js){
				this.show_console_error(6);
			}else{
				$.each(this.files.js, function (index, js) {
					var html = $('<script>', {
						'type': "text/javascript",
						'src': js
					});
					smart_goose.inner_html(html);
				});
			}
		},
		mask_input_phone: function(){
			if(!window.Inputmask)
				this.show_console_error(10);
			else{
				$(this.popup_settings.selector)
					.find('.input-phone-mask')
					.inputmask({
						mask: this.popup_settings.phone.mask,
						placeholder: this.popup_settings.phone.mask_placeholder
					});
			}
		},
		inner_html: function(html){
			$('body').append(html);
		},
		inner_configs_popup: function(){
			$(smart_goose.popup_settings.thanks_text_selector)
				.html(smart_goose.popup_settings.thanks_text);
			$(smart_goose.popup_settings.thanks_title_selector)
				.html(smart_goose.popup_settings.thanks_title);
			$(smart_goose.popup_settings.title_selector)
				.html(smart_goose.popup_settings.title);
			$(smart_goose.popup_settings.selector)
				.find('button[type=submit]')
				.text(smart_goose.popup_settings.button_send_text);
		},
		check_jquery: function(){
			if(!window.jQuery){
				this.show_alert('reload');
				this.show_console_error(2);
			}
		},
		show_alert: function(alert_message){
			if(this.alerts[alert_message])
				alert(this.alerts[alert_message]);
			else
				this.show_console_error(3);
		},
		show_console_error: function(code){
			var error_message = "🦆 OH NO! ULTRA MEGA ERROR /(o.o)\\ \n";

			if(this.errors[code])
				console.error(error_message + this.errors[code]);
			else
				console.error(error_message + this.errors[2]);
		},
		show_input_error: function(input_element, error_message){
			var error_block = input_element.prev('.input-error-block');

			if(error_block.length === 0){
				error_block = input_element
					.before('<div class="input-error-block"></div>')
					.prev('.input-error-block');
			}

			error_block
				.addClass('show')
				.html(error_message);
			input_element
				.addClass('input-error')
				.focus();

			setTimeout(function () {
				smart_goose.hide_input_error(input_element, error_block);
			}, smart_goose.popup_settings.error_block_show_duration);
		},
		hide_input_error: function(input_element, error_block){
			error_block
				.removeClass('show');
			input_element
				.removeClass('input-error');
		},
		lock_submit_form: function(form){
			form
				.find('button[type=submit]')
				.attr('disabled', 'disabled')
				.text(smart_goose.popup_settings.button_waiting_text);
		},
		unlock_submit_form: function(form){
			form
				.find('button[type=submit]')
				.removeAttr('disabled')
				.text(smart_goose.popup_settings.button_send_text);
		},
		show_form_error: function(form, error){
			form
				.find(smart_goose.popup_settings.error_form_selector)
				.html(error)
				.addClass('show');
		},
		show_thanks: function(){
			$(smart_goose.popup_settings.form_selector)
				.hide();
			$(smart_goose.popup_settings.thanks_selector)
				.show();
		},
		send_form: function(form){
			form = $(form);
			var data = form.serializeArray();

			if(!smart_goose_validator.validate(data))
				return false;

			this.lock_submit_form(form);

			$.ajax({
				type: "POST",
				url: smart_goose.handler,
				data: data,
				dataType: 'JSON',
				success: function (response) {
					if(response.status){
						smart_goose.show_thanks();
					}else{
						console.error(response);
						smart_goose.unlock_submit_form(form, smart_goose.handler_errors.other);
					}
				},
				error: function (response) {
					console.error(response);
					smart_goose.unlock_submit_form(form, smart_goose.handler_errors.other);
				},
				complete: function () {
					smart_goose.unlock_submit_form(form);
				}
			});
		},
		bind_keyup: function(){
			$(document).on('keyup', function(event) {
				if (event.keyCode === 27) {
					smart_goose.hide_popup();
				}
			});
		},
		bind_mousedown: function(){
			$(this.popup_settings.selector).on('mousedown', function(event) {
				if($(smart_goose.popup_settings.selector).is(event.target))
					smart_goose.hide_popup();
			});
		},
		init: function () {
			this.check_jquery();
			this.load_css();
			this.load_js();
			this.load_popup();
		}
	},

	smart_goose_validator = {
		validate: function(data){
			var result = true;

			$.each(data, function (index, item) {
				if(!result) return false;
				switch (item.name){
					case smart_goose.popup_settings.phone.name:
						result = smart_goose_validator.validate_phone(item.value);
						break;

					// YOUR CUSTOM VALIDATE
				}
			});

			return result;
		},
		validate_phone: function(phone){
			var result = true;
			if(smart_goose.popup_settings.phone.require){
				if(smart_goose.popup_settings.phone.masking){
					var regexp = new RegExp(smart_goose.popup_settings.phone.mask_placeholder, 'g');

					result = phone.replace(regexp, "").length === smart_goose.popup_settings.phone.mask.length;
				}else
					result = phone.replace(" ", "").length >= smart_goose.popup_settings.phone.valid_length;
			}

			if(!result)
				smart_goose.show_input_error(
					$(smart_goose.popup_settings.selector).find('input[name=' + smart_goose.popup_settings.phone.name + ']'),
					smart_goose.validate_errors.phone
				);

			return result;
		},
	};

window.onload = function(){
	smart_goose.init();
};

