'use strict';

import { Attributes, SpanKind } from "@opentelemetry/api";

const opentelemetry = require('@opentelemetry/api');

// Not functionally required but gives some insight what happens behind the scenes
const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NodeTracerProvider, Sampler } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { AlwaysOnSampler } from '@opentelemetry/sdk-trace-base';
import {  SemanticResourceAttributes as ResourceAttributesSC, SemanticAttributes } from '@opentelemetry/semantic-conventions';

import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { GrpcInstrumentation } from "@opentelemetry/instrumentation-grpc";

export const setupTracing = (serviceName: string) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [ResourceAttributesSC.SERVICE_NAME]: serviceName,
    }),
    sampler: filterSampler(ignoreHealthCheck, new AlwaysOnSampler()),
  });
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      // Express instrumentation expects HTTP layer to be instrumented
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new GrpcInstrumentation()
    ],
  });

  provider.addSpanProcessor(new BatchSpanProcessor(new JaegerExporter()));
  console.log('loading of open telemetry');
  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer(serviceName);
};
type FilterFunction = (spanName: string, spanKind: SpanKind, attributes: Attributes) => boolean;

function filterSampler(filterFn: FilterFunction, parent: Sampler): Sampler {
  return {
    shouldSample(ctx, tid, spanName, spanKind, attr, links) {
      if (!filterFn(spanName, spanKind, attr)) {
        return { decision: opentelemetry.SamplingDecision.NOT_RECORD };
      }
      return parent.shouldSample(ctx, tid, spanName, spanKind, attr, links);
    },
    toString() {
      return `FilterSampler(${parent.toString()})`;
    }
  }
}

function ignoreHealthCheck(_spanName: string, spanKind: SpanKind, attributes: Attributes) {
  return spanKind !== opentelemetry.SpanKind.SERVER || attributes[SemanticAttributes.HTTP_ROUTE] !== "/health";
}