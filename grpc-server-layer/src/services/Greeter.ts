import {
  sendUnaryData, ServerDuplexStream, ServerReadableStream, ServerUnaryCall, ServerWritableStream,
  status, UntypedHandleCall
} from '@grpc/grpc-js';

import { GreeterServer, GreeterService, HelloRequest, HelloResponse } from '@vaneri/grpc-models/lib/models/helloworld';
//import { TestVaneri } from '@vaneri/simple-node-grpc-models/lib/models/testvaneri';
import { logger, ServiceError } from '../utils';
import putMessage from './KafkaProducer';

/**
 * package helloworld
 * service Greeter
 */
class Greeter implements GreeterServer {
  [method: string]: UntypedHandleCall;

  /**
   * Implements the SayHello RPC method.
   */
  public sayHello(call: ServerUnaryCall<HelloRequest, HelloResponse>, callback: sendUnaryData<HelloResponse>): void {
    logger.info('sayHello', Date.now());


    const res: Partial<HelloResponse> = { message: "nice work buddy" };
    const { name } = call.request;
    logger.info('sayHelloName:', name);
    putMessage({ correlationId: name, message: "yeahhhhhhhh" });

    if (name === 'error') {
      // https://grpc.io/grpc/node/grpc.html#.status__anchor
      return callback(new ServiceError(status.INVALID_ARGUMENT, 'InvalidValue'), null);
    }

    callback(null, HelloResponse.fromJSON(res));
  }

  public sayHelloStreamRequest(call: ServerReadableStream<HelloRequest, HelloResponse>, callback: sendUnaryData<HelloResponse>): void {
    logger.info('sayHelloStreamRequest:', call.getPeer());
    callback(new ServiceError(status.INTERNAL, 'err.message'), null);

  }

  public sayHelloStreamResponse(call: ServerWritableStream<HelloRequest, HelloResponse>): void {
    logger.info('sayHelloStreamResponse:', call.request);

  }

  public sayHelloStream(call: ServerDuplexStream<HelloRequest, HelloResponse>): void {
    logger.info('sayHelloStream:', call.getPeer());
  }
}

export {
  Greeter,
  GreeterService,
};
