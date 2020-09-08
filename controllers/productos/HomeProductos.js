const handleBuscarProductos = (req, res, db) => {
    db.select().table('productos')
    .then(response => {
        response.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
          });
        res.json(response)
    })
.catch(err => res.status(500).json('problema con la base de datos + ' + err))
}

module.exports = {
   handleBuscarProductos
}