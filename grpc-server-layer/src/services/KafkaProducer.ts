import { Kafka, ProducerRecord } from "kafkajs";
import { logger } from "../utils";


const kafka = new Kafka({
    clientId: "test-app",
    brokers: ["localhost:9092"],
});

export interface MyMessage {
    correlationId?: string,
    message: string;
}
let key = 1900;
const producer = kafka.producer();
export default async function putMessage(myMessage: MyMessage) {
    await producer.connect();
    logger.info(`producer intiatilized`);
    const record: ProducerRecord = {
        topic: "number",
        messages: [{ key: `${key++}`, value: JSON.stringify(myMessage), partition:0 }],
    };
    await producer.send(record);
    await producer.disconnect();
    logger.info(`message sent to ${record.topic}`);
}
