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
connect();


async function connect(){
try {
    
    const conn= await amqp.connect(rabbitConf);
    console.log("Conexion Establecida no bulto");
    const canal= await conn.createChannel();
    canal.consume(cola,mensaje=>{
        let msj=JSON.parse(mensaje.content.toString());
        console.log("Se ha recibido un mensaje:");
        console.log(msj);
        canal.ack(mensaje);
        console.log("Se ha eliminado el mensaje.");
    });

} catch (error) {
    console.error(error);
}    
}