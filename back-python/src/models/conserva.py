from config import *
class Conserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    produto = db.Column(db.String(200), nullable=False)
    marca = db.Column(db.String(200), nullable=False)
    validade = db.Column(db.String(200), nullable=True)
    peso = db.Column(db.String(200), nullable=True)
    preco = db.Column(db.String(200), nullable=False)

    def json(self):
        return {
            "id":self.id,
            "produto":self.produto,
            "marca":self.marca,
            "validade":self.validade,
            "peso":self.peso,
            "preco":self.preco
            }

