const handleBuscarEventoId = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('eventos').where({
        id: id
    }).then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('evento no encontrado')
        }
    })
    .catch(err => res.status(400).json('error buscando empresa'))

}

module.exports = {
    handleBuscarEventoId
}