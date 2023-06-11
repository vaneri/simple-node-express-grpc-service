
import 'source-map-support/register';
import { credentials, ServiceError } from '@grpc/grpc-js';
import { GreeterClient, HelloRequest, HelloResponse } from '@vaneri/grpc-models/src/models/helloworld'

import Log from '../../../middlewares/Log';

class GreatingGRPCClient {

    //https://github.com/grpc/grpc/blob/master/doc/keepalive.md
    private client = new GreeterClient('localhost:50051', credentials.createInsecure(), {
        'grpc.keepalive_time_ms': 120000,
        'grpc.http2.min_time_between_pings_ms': 120000,
        'grpc.keepalive_timeout_ms': 20000,
        'grpc.http2.max_pings_without_data': 0,
        'grpc.keepalive_permit_without_calls': 1,
    });


    public async sayHello(): Promise<HelloResponse> {

        const param: HelloRequest = {
            name: "argv",
        };

        const promise: Promise<HelloResponse> = new Promise((resolve, reject) => {
            this.client.sayHello(param, (err: ServiceError | null, helloResponse: HelloResponse) => {
                if (err) {
                    Log.error(`sayBasic: ${err.stack}`);
                    return reject('doesn\'t work');
                }
                Log.info(`sayBasic: ${helloResponse.message}`);
                return resolve(helloResponse);
            });
        });

        return promise;
    }
}

export default GreatingGRPCClient;