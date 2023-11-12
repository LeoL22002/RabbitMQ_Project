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
const msgs = [
  {"mensaje": "Wao"},
  {"mensaje": "El que quiera perder su tiempo que me aconseje"},
  {"mensaje": "Ivan deme lo 55 punto polfavol"},
  {"mensaje": "El que ta quemao no folza"},
  {"mensaje": "Ya sume to y yo paso en C"},
  {"mensaje": "Aunque sea un 70 profe :("}
];

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

    const result = await channel.assertQueue(cola);
    console.log('Cola creada');

    for (const msg of msgs) {
      await channel.sendToQueue(cola, Buffer.from(JSON.stringify(msg)));
      console.log('Mensaje enviado');
    }
  } catch (error) {
    console.error('Error durante la operación con RabbitMQ:', error.message);
  } 
  // finally {
  //   // Asegúrate de cerrar la conexión y el canal al finalizar
  //  // if (channel) await channel.close();
  //  // if (connection) await connection.close();
  //  // console.log('Conexión cerrada');
  // }
}
