const handleBuscarProducto = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('productos').where({
        id: id
    }).then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('producto no encontrado')
        }
    })
    .catch(err => res.status(400).json('error buscando producto'))

}

module.exports = {
    handleBuscarProducto
}