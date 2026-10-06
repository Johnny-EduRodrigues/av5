from config import *
from models.conserva import Conserva


def criar_conserva(data):

    # criar a conserva
    conserva = Conserva(
        produto=data['produto'],
        marca=data['marca'],
        validade=data.get('validade'),
        peso=data.get('peso'),
        preco=data['preco']
    )

    # salvar no banco de dados
    db.session.add(conserva)
    db.session.commit()

    return conserva


def retornar_conservas():

    # buscar todas as conservas no banco de dados
    conservas = Conserva.query.all()

    return conservas