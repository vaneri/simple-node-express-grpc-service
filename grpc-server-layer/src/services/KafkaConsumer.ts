import { Kafka } from "kafkajs";
import { logger } from "../utils";


const kafka = new Kafka({
  clientId: "test-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-consumer-group" });
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "number", fromBeginning: true });
  logger.info(`consumer intiatilization`);
  await consumer.run({
    eachMessage: async ({ partition, message }) => {
      logger.info("Received: ", {
        partition,
        offset: message.offset,
        value: message!.value!.toString(),
      });
    },
  });
}

let KafkaConsumerTestApp = () => run().catch(logger.error)

export default KafkaConsumerTestApp;