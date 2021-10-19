import feathers from '@feathersjs/client';
import io from 'socket.io-client';



// console.log('==config.dsturl:',config.dsturl);
const client = feathers();

// const socket = io("http://localhost:3030");
const socket = io();
client.configure(feathers.socketio(socket, {
  timeout: 10000,
}));
client.configure(feathers.authentication({
  storage: window.localStorage
}));
export default client;