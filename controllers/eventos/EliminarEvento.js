const handleBorrarEvento = (req, res, db) => {
    const { id } = req.params;
    db('eventos').where({id})
    .del()
    .then(res.json('borrado exitoso!'))
}


module.exports = {
    handleBorrarEvento: handleBorrarEvento
}