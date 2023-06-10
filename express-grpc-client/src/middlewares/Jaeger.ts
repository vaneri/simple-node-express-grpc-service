
import * as express from 'express';
import Log from './Log';
import JaegerTracing from '../tracer/tracer';


enum Tags {
    HTTP_METHOD = "HTTP_METHOD",
    HTTP_URL = "HTTP_URL",
    SPAN_KIND = "SPAN_KIND",
    SPAN_KIND_RPC_SERVER = "SPAN_KIND_RPC_SERVER",
    HTTP_STATUS_CODE = "HTTP_STATUS_CODE"
}
class JaegerMiddleware {


	public static mount(_express: express.Application): express.Application {
		Log.info('Setup Jaeger middleware...');

		const tracer = JaegerTracing.initJaegerTracer();

		_express.use((request:express.Request, response:express.Response, next:express.NextFunction) => {
			const spanContext = JaegerTracing.extractSpanContextFromRequest(request);

			const span = tracer.startSpan(request.path, { childOf: spanContext || undefined});
			span.setTag(Tags.HTTP_METHOD, request.method);
			span.setTag(Tags.HTTP_URL, request.url);
			span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_SERVER);

			request.span = span;
			response.on('finish', () => {
				span.setTag(Tags.HTTP_STATUS_CODE, response.statusCode);
				span.finish();
			});

			next();
		});


		return _express;
	}
}

export default JaegerMiddleware;
