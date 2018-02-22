// tslint:disable-next-line:no-var-keyword
// tslint:disable-next-line:prefer-const
var env = 'dev';

const __baseUrl = '';
const __configuration = {
	'baseUrl': '',
	'port': '',
	'encryption': false,
	'encryptionKey': 'R@j',
	'logs': true
};

function getConfig() {
	switch (env) {
		case 'dev':
			__configuration.baseUrl = '/api';
			break;
		case 'local':
		// http://180.214.19.214:4200/api
		// http://10.64.19.214:4200/api
		// http://10.64.19.214:4200/
		// http://10.64.19.215:4400
		// http://10.64.19.215:3100 prod
			__configuration.baseUrl = 'http://10.64.19.215:4200/api';
			__configuration.encryption = true;
			break;
		case 'uat':
			__configuration.baseUrl = '';
			__configuration.encryption = true;
			__configuration.logs = false;
			break;
		case 'prod':
			__configuration.baseUrl = 'http://prodenv.com';
			__configuration.port = '8080';
			break;
		default:
			__configuration.baseUrl = 'http://devenv.com';
			__configuration.port = '8080';
	}
	return __configuration;
}


export const config = getConfig();
