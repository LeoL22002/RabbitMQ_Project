const amqp=require("amqplib");
const rabbitConf={
protoccol: 'amqp',
hostname: 'localhost',
port:5672,
username:'leo22002',
password:'root',
vhost:'/',
authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']
}
const cola="mensajes";
const msgs=[
    {"mensaje":"Wao"},
    {"mensaje":"El que quiera perder su tiempo que me aconseje"},
    {"mensaje":"Ivan deme lo 55 punto polfavol"},
    {"mensaje":"El que ta quemao no folza"},
    {"mensaje":"Ya sume to y yo paso en C"},
    {"mensaje":"Aunque sea un 70 profe :("}
];
connect();


async function connect(){
try {
    
    const conn= await amqp.connect(rabbitConf);
    console.log("Conexion Estbalecida");
    const canal= await conn.createChannel();
    console.log("Canal Creado");
    const res= await canal.assertQueue(cola);
    console.log("Cola Creada");
    for (let msg in msgs) {
        await canal.sendToQueue(cola,Buffer.from(JSON.stringify(msgs[msg])))
        console.log("Mensaje Enviado");
    }

} catch (error) {
    console.error(error);
}    
}