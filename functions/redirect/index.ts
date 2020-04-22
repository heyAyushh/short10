import { AzureFunction, Context, HttpRequest, BindingDefinition } from '@azure/functions';
import * as redis from 'redis';
import * as bluebird from 'bluebird';

const Link = require('../links/model_links.js');

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const httpTrigger: AzureFunction = async function(context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    // route passed in parameters, binding so that we can https://url/api/redirect/{redirect}
    const redirect = context.bindingData.redirect || req.params.redirect;
    console.log('redirect - ', redirect)
    
	// Redirect after loading a link with hash
	// find in redis first
	// find in db after not found in redis - add to redis if found in db
	// return 404 after not found in db
	// cache-aside pattern https://docs.microsoft.com/en-in/azure/architecture/patterns/cache-aside

	// Connect to the Azure Cache for Redis over the TLS port using the key.
	var cacheConnection = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, {
		auth_pass: process.env.REDISCACHEKEY,
		tls: { servername: process.env.REDISCACHEHOSTNAME }
	});

	// Find in redis
    //@ts-ignore
    let url = await cacheConnection.getAsync('url:' + redirect)

    if (url) {
		// fetched from Redis
		context.log(' Redis cached ');
		context.res = {
			status: 302 /* Defaults to 200 */,
			body: '... Redirecting',
			headers: {
				location: url
			}
		};
    } 

    if (!url) {
        // Fetched from DB
        const data = await Link.find({ shortenedUrl: redirect });
        if(data.length){
            url = data[0].url;

            // set in redis and add 2 months TTL 
            //@ts-ignore
            let response = await cacheConnection.setAsync('url:' + redirect, url, 'EX', process.env.LINK_EXPIRY);
            context.log('Fetched from DB, added in Redis. Response = ' + response);
    
            context.res = {
                status: 302,
                body: '... Redirecting',
                headers: {
                    location: url
                }
            };
        }else{
            context.res = {
                status: 404 /* Defaults to 200 */,
                body: 'LINK NOT FOUND'
            };
        }
	}
};

export default httpTrigger;
