import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const ping: AzureFunction = async function(context: Context, req: HttpRequest): Promise<void> {
	context.log('Function processed a ping request.');
	context.res = {
		// status: 200, /* Defaults to 200 */
		body: 'pong 🏓'
	};
};

export default ping;