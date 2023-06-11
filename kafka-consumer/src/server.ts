import { setupTracing } from './tracing/Instrumentations';
setupTracing('kafka-consumer');

import KafkaConsumer from './services/KafkaConsumer';

KafkaConsumer()
