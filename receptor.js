const amqp = require('amqplib');

const rabbitConf = [
  {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
  },
  {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5673,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
  }
];

const cola = 'mensajes';

connect();

async function connect() {
  let connection;
  let channel;

  for (const config of rabbitConf) {
    try {
      // Intenta conectar al nodo actual
      connection = await amqp.connect(config);
      console.log(`Conexión establecida con ${config.hostname}:${config.port}`);

      // Si la conexión es exitosa, sal del bucle
      break;
    } catch (error) {
      console.error(`Error al conectar a ${config.hostname}:${config.port}: ${error.message}`);
    }
  }

  if (!connection) {
    console.error('No se pudo conectar a ninguno de los nodos.');
    return;
  }

  try {
    channel = await connection.createChannel();
    console.log('Canal creado');

        await channel.assertQueue(cola);

    console.log('Esperando mensajes. Para salir, presiona CTRL+C');

    // Configura el consumidor para recibir mensajes de la cola
    channel.consume(cola, (mensaje) => {
      if (mensaje !== null) {
        let msj = JSON.parse(mensaje.content.toString());
        
        console.log("->",msj);
        channel.ack(mensaje);
        console.log('Se ha eliminado el mensaje.');
      }
      else{
        console.log('Usted no tiene mensajes.');
      }
    });
  } catch (error) {
    console.error('Error durante la operación con RabbitMQ:', error.message);
  } 
 
}
