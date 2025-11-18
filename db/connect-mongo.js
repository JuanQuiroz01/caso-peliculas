const mongoose = require('mongoose');

const getConnection = async () => {
    try{
        const url = 'mongodb+srv://0001:0001@cluster0.ed0va.mongodb.net/?appName=Cluster0'  
        await mongoose.connect(url);

        console.log('conexion exitosa')
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
    module.exports = {
        getConnection,
    }
    
