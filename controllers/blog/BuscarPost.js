const handleBuscarPostId = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('blog').where({
        id: id
    }).then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('post no encontrado')
        }
    })
    .catch(err => res.status(400).json('error buscando post: ' + err))

}

module.exports = {
    handleBuscarPostId
}