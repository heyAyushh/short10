import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { verify, VerifyOptions } from 'azure-ad-verify-token';
import { isUri } from 'valid-url';
import { generate } from 'shortid';
import * as redis from 'redis';
import * as bluebird from 'bluebird';
// Using local.settings.json instead of dotenv
// import { config } from 'dotenv';
// import { resolve } from 'path';

// config({ path: resolve(__dirname, '../.env') });

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const Link = require('./model_links.js');

const options: VerifyOptions = {
	jwksUri: process.env.JWKS_URI,
	issuer: process.env.ISSUER,
	audience: process.env.AUDIENCE
};

const httpTrigger: AzureFunction = async function(context: Context, req: HttpRequest): Promise<void> {
	context.log('HTTP trigger function processed a request.');
	//@ts-ignore
	let token = req.headers['x-ms-token-aad-id-token'];

	try {
		var cacheConnection = redis.createClient(6380, process.env.REDISCACHEHOSTNAME, {
			auth_pass: process.env.REDISCACHEKEY,
			tls: { servername: process.env.REDISCACHEHOSTNAME }
		});

		let decoded: Object = await verify(token, options);
		//@ts-ignore
		const user: String = decoded.upn;
		let admin = user == process.env.ADMIN_MAIL && req.body.by == 'ADMIN';
		const body = req.body;

		if (req.method == 'GET') {
			//Give the generated links

			if (admin) {
				//Show ALL
				const data = await Link.find({});

				context.res = {
					// status: 200, /* Defaults to 200 */
					body: data
				};
			} else {
				// Show links by user
				const data = await Link.find({ user: user });
				context.res = {
					// status: 200, /* Defaults to 200 */
					body: data
				};
			}
		} else if (req.method == 'POST') {
			//Generate a Shortened link

			if (!body.url || !isUri(body.url)) {
				throw "POST Body either don't have URL";
			} else {
				const newShortenedUrl = body.shortenedUrl ? body.shortenedUrl : generate();
				const link = new Link({
					user: user,
					shortenedUrl: newShortenedUrl,
					url: body.url
				});

				const savedLink = await link.save();

				context.res = {
					status: 201 /* Defaults to 200 */,
					body: savedLink.toJSON()
				};
			}
		} else if (req.method == 'PUT' && body.shortenedUrl && body.url && req.params.id) {
			// Edit or Update link

			const body = req.body;

			const link = {
				user: user,
				shortenedUrl: body.shortenedUrl || generate(),
				url: body.url
			};

			if (admin) {
				const response = await Link.findByAndUpdate(req.params.id, link, { new: true });
				if (response) {
					//@ts-ignore
					let redisresponse = await cacheConnection.setAsync(
						'url:' + body.shortenedUrl,
						body.url,
						'EX',
						process.env.LINK_EXPIRY
					);

					context.res = {
						status: 200 /* Defaults to 200 */,
						body: response.toJSON()
					};
				}
			} else {
				// if not admin
				const response = await Link.findAndModify({ id: req.params.id, user: user }, link, { new: true });

				if (response) {
					//@ts-ignore
					let redisresponse = await cacheConnection.setAsync(
						'url:' + body.shortenedUrl,
						body.url,
						'EX',
						process.env.LINK_EXPIRY
					);

					context.log(' Redis : ', redisresponse, ' MongoResponse : ', response);

					context.res = {
						status: 200 /* Defaults to 200 */,
						body: response.toJSON()
					};
				}
			}
		} else if (req.method == 'DELETE' && req.params.id) {
			if (admin) {
				// Delete link
				const response = await Link.findByIdAndDelete(req.params.id);
				context.res = {
					status: 204 /* Defaults to 200 */,
					body: response
				};
			} else {
				// Delete link
				const response = await Link.remove({ id: req.params.id, user: user }, { justOne: true });
				context.res = {
					status: 204 /* Defaults to 200 */,
					body: response
				};
			}
		} else {
			//Other methods not allowed
			context.res = {
				status: 405
			};
		}
	} catch (error) {
		console.error(error);
		context.res = {
			status: 400,
			body: error
		}
	}
};

export default httpTrigger;
