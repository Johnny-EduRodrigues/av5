from config import *
from models.conserva import Conserva
import services.conserva as conserva_service


'''
----------------
LISTAR CONSERVAS
----------------
'''

# rota para listar conservas
@app.route('/conservas', methods=['GET'])
def retornar_conservas():

    # buscar as conservas
    conservas = conserva_service.retornar_conservas()

    # retornar a lista de conservas em JSON
    return jsonify({
        "resultado": "ok",
        "detalhes": [conserva.json() for conserva in conservas]
    })


'''
-----------------
INCLUIR CONSERVA
-----------------
'''

# rota para inserir uma conserva
@app.route('/conserva', methods=['POST'])
@jwt_required()
def criar_conserva():

    # ler os dados em JSON
    dados = request.json

    # verificar dados obrigatórios
    if (
        not dados
        or not dados.get('produto')
        or not dados.get('marca')
        or not dados.get('preco')
    ):
        return jsonify({
            "resultado": "erro",
            "detalhes": "Produto, marca e preço são obrigatórios"
        }), 400

    # chama o serviço de criação
    conserva = conserva_service.criar_conserva(dados)

    # retornar mensagem de sucesso
    return jsonify({
        "resultado": "ok",
        "detalhes": conserva.json()
    }), 201