const handleModificarProducto = (req, res, db) =>{
    const { id } = req.params;
     const { 
        nombre,
        descripcion,
        precio

        } = req.body;

               db('productos').where({ id }).update({     
                nombre,
                descripcion,
                precio
             }).then(res.status(200).json('actualizado'))
          
         
         }
 module.exports = {
     handleModificarProducto
 }