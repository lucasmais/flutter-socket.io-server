const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');
// console.log('init-server');

const bands = new Bands();
bands.addBand(new Band('Korn'));
bands.addBand(new Band('Rammstein'));
bands.addBand(new Band('SOAD'));
bands.addBand(new Band('Limp Bizkit'));

// console.log(bands);

//Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado'); 

    client.emit('active-bands',bands.getBands());


    client.on('disconnect', () => { 
        console.log('Cliente desconectado'); 
    });

    client.on('mensaje',(payload)=>{
        console.log('Mensaje!!!',payload);

        io.emit('mensaje',{admin:'Nuevo mensaje'});
    });

    client.on('nuevo-mensaje',(payload)=>{
        // console.log(payload);
        // io.emit('nuevo-mensaje',payload);// emite a todos
        client.broadcast.emit('nuevo-mensaje',payload);//emite a todos menos a quien lo emitio
    })

    client.on('vote-band',(payload)=>{
        console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    })

    client.on('add-band',(payload)=>{
        console.log(payload);
        bands.addBand(new Band(payload.name));
        io.emit('active-bands',bands.getBands());
    })

    client.on('delete-band',(payload)=>{
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    })
});