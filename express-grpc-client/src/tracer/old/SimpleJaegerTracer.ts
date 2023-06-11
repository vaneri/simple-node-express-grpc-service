import { Request } from 'express';
import { initTracer, TracingConfig, TracingOptions } from 'jaeger-client';
import { FORMAT_HTTP_HEADERS, SpanContext, Tracer } from 'opentracing';

class JaegerTracing {
    private static tracer: Tracer;

    public static initJaegerTracer = (): Tracer => {
        const config: TracingConfig = {
            serviceName: 'express-grpc-client-app',
            sampler: { type: 'const', param: 1 },
            reporter: { logSpans: true },
        };

        const options: TracingOptions = {
            logger: {
                info(msg: string) {
                    console.log('INFO', msg);
                },
                error(msg: string) {
                    console.log('ERROR', msg);
                },
            },
        };

        this.tracer = initTracer(config, options);
        return this.tracer;
    }

    public static extractSpanContextFromRequest = (request: Request): SpanContext | null => {
        return this.tracer.extract(FORMAT_HTTP_HEADERS, request.headers);;
    }
}
export default JaegerTracing;