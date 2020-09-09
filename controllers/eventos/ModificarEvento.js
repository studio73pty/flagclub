const handleModificarEvento = (req, res, db) =>{
    const { id } = req.params;
     const { 
        nombre,
        intro,
        descripcion,
        fecha 
        } = req.body;

               db('eventos').where({ id }).update({     
                nombre,
                intro,
                descripcion,
                fecha 
             }).then(res.status(200).json('post actualizado'))
          
         
         }
 module.exports = {
     handleModificarEvento
 }