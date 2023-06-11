'use strict';
const opentelemetry = require('@opentelemetry/api');

// Not functionally required but gives some insight what happens behind the scenes
const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes as ResourceAttributesSC } from '@opentelemetry/semantic-conventions';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';


export const setupTracing = (serviceName: string) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [ResourceAttributesSC.SERVICE_NAME]: serviceName,
    }),
  });
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      new GrpcInstrumentation(),
      new KafkaJsInstrumentation()
    ],
  });

  provider.addSpanProcessor(new BatchSpanProcessor(new JaegerExporter()));
  console.log('loading of open telemetry');
  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer(serviceName);
};
