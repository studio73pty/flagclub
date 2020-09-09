const handleModificarPost = (req, res, db) =>{
    const { id } = req.params;
     const { 
        nombre,
        intro,
        contenido,

        } = req.body;

               db('blog').where({ id }).update({     
                nombre,
                intro,
                contenido
             }).then(res.status(200).json('post actualizado'))
          
         
         }
 module.exports = {
     handleModificarPost
 }