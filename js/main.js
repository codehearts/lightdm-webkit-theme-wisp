var login = (function (lightdm) {
	var user = document.getElementById('user'),
		pass = document.getElementById('password'),
		selected_user = null,
		password = null,
		debug = false;

	// Private functions
	var debug_msg = function(msg) {
		if (debug) {
			document.body.insertAdjacentHTML(
				'beforeend',
				'<p class="debug">DEBUG: '+msg+'</p>'
			);
		}
	}

	var setup_users_list = function () {
		debug_msg('setup_users_list() called');

		var list = user;
		for (var i = 0; i < lightdm.users.length; i++) {
			if (lightdm.users.hasOwnProperty(i)) {
				var username = lightdm.users[i].name;
				var dispname = lightdm.users[i].display_name;

				list.insertAdjacentHTML(
					'beforeend',
					'<option value="'+username+'">'+username+'</option>'
				);

				debug_msg('User `'+username+'` found');
			}
		}
	};

	var select_user_from_list = function (idx) {
		var idx = idx || 0;

		find_and_display_user_picture(idx);

		if (lightdm._username) {
			lightdm.cancel_authentication();
		}

		selected_user = lightdm.users[idx].name;
		if (selected_user !== null) {
			window.start_authentication(selected_user);
		}
	};

	var find_and_display_user_picture = function (idx) {
		document.getElementById('profile-image').getElementsByTagName('img')[0].src = lightdm.users[idx].image;
	};

	// Functions that lightdm needs
	window.start_authentication = function (username) {
		lightdm.cancel_timed_login();
		lightdm.start_authentication(username);
	};
	window.provide_secret = function () {
		debug_msg('window.provide_secret() called');
		password = pass.value || null;

		if (password !== null) {
			debug_msg('window.provide_secret() password not null');
			lightdm.provide_secret(password);
		}
	};
	window.authentication_complete = function () {
		if (lightdm.is_authenticated) {
			debug_msg('Logged in');
			lightdm.login(
				lightdm.authentication_user,
				lightdm.default_session
			);
		}
	};
	// These can be used for user feedback
	window.show_error = function (e) {
		console.log('Error: ' + e);

	};
	window.show_prompt = function (e) {
		console.log('Prompt: ' + e);
	};

	// exposed outside of the closure
	var init = function () {
		debug_msg('init() called');

		setup_users_list();
		select_user_from_list();

		user.addEventListener('change', function (e) {
			e.preventDefault();

			var idx = e.currentTarget.selectedIndex;
			select_user_from_list(idx);
		});

		document.getElementById('login-form').addEventListener('submit', function (e) {
			debug_msg('Form submitted');
			e.preventDefault();
			window.provide_secret();
		});

		document.getElementById('shutdown').addEventListener('click', function (e) {
			debug_msg('Shutting down');
			lightdm.shutdown();
		});

		document.getElementById('reboot').addEventListener('click', function (e) {
			debug_msg('Restarting');
			lightdm.restart();
		});
	};

	return {
		init: init
	};
} (lightdm));

login.init();
