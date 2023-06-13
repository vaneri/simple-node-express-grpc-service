# assuming to have an docker image called jaeger
exec docker start jaeger &
echo 'starting grpc layer'
exec npm run start:grpc_server_layer &
echo 'starting kafka consumer'
exec npm run start:kafka_consumer &
echo 'starting grpc client'
exec npm run start:express_grpc_client &