# simple-node-express-grpc-service
Test of grpc service from a client to a server, with the integration of kakfa behind the scenes
Usage of protocolbuffer service/model generation, kafka, node express


# Prerequisite
Download kafka
https://kafka.apache.org/downloads

Install typescript globally
```console
npm install -g typescript 
```

# how to get started
1. Create a protocol buffer model & compile the source code
```console
npm run build
```
2 start kafka
```console
bin/zookeeper-server-start.sh config/zookeeper.properties
bin/kafka-server-start.sh config/server.properties
```
3. start the grpc server   
```console
npm run start:server
```
4. start the client
```console
npm run start:client
```
5. test the greating end-point: 
```console
curl  http://localhost:4040/api/person/greating
```

