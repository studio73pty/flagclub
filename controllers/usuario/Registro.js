const handleRegistro = (req, res, db, bcrypt) => {
    const { email, usuario, password } = req.body;
    const hash = bcrypt.hashSync(password);
    if(!email || !usuario || !password){
        return res.status(400).json('por favor llena todos los campos');
    }

   // res.json(email + ' ' + usuario + ' ' + password)

    db('registro').insert({
        email,
        usuario,
        hash
    })
        .then(res.status(200).json('usuario registrado exitosamente'))
    
    .catch(err => res.status(400).json('no se pudo registrar: ' + err));
}


module.exports = {
    handleRegistro: handleRegistro
}