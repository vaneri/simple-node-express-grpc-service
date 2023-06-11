import { Kafka } from "kafkajs";
import { logger } from "../utils/logger";


const kafka = new Kafka({
  clientId: "test-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-consumer-group" });
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "number" });
  logger.info(`consumer intiatilization`);
  await consumer.run({
    eachMessage: async ({ partition, message }) => {
      logger.info("Consumer is receiving something, youhouuuu: ", {
        partition,
        offset: message.offset,
        value: message!.value!.toString(),
      });
    },
  });
}

let KafkaConsumer = () => run().catch(logger.error)
export default KafkaConsumer;