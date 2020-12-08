import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { withRouter } from 'react-router-dom'
import UsuarioService from '../app/service/usuarioService'
import { mensagemSucesso, mensagemErro } from '../components/toastr'

class CadastroUsuario extends React.Component {


    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor() {
        super();
        this.service = new UsuarioService()
    }

    cadastrar = () => {

        const usuario = { nome: this.state.nome, email: this.state.email, senha: this.state.senha, senhaRepeticao: this.state.senhaRepeticao }

        try {
            this.service.validar(usuario);
        } catch (error) {
            const msgs = error.mensagens;
            msgs.forEach((msg, index) => {
                mensagemErro(msg)
            });
            return false;
        }

        this.service.salvar(usuario)
            .then(response => {
                mensagemSucesso('Usuário cadastrado. Faça o login para acessar o sistema')
                this.props.history.push('/login')
            })
            .catch(error => {
                mensagemErro(error.response.data)
            })
    }



    cancelar = () => {
        this.props.history.push('/login')
    }

    render() {
        return (
            <Card title="Cadastro de usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <fieldset>
                                <FormGroup label="Nome: *" htmlFor="exampleInputNome">
                                    <input type="email" className="form-control" id="exampleInputNome" aria-describedby="emailHelp" placeholder="Digite o Nome"
                                        name="nome" onChange={e => this.setState({
                                            nome: e.target.value
                                        })} />
                                </FormGroup>
                                <FormGroup label="Email: *" htmlFor="InputEmail">
                                    <input type="email" className="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Digite o Email"
                                        name="email" onChange={e => this.setState({
                                            email: e.target.value
                                        })} />
                                    <small id="emailHelp" className="form-text text-muted">Não divulgamos o seu email.</small>
                                </FormGroup>
                                <FormGroup label="Senha: *" htmlFor="InputPassword">
                                    <input type="password" className="form-control" id="InputPassword" placeholder="Password"
                                        name="senha" onChange={e => this.setState({
                                            senha: e.target.value
                                        })} />
                                </FormGroup>
                                <FormGroup label="Repita a senha: *" htmlFor="exampleInputPassword2">
                                    <input type="password" className="form-control" id="exampleInputPassword2" placeholder="Password"
                                        name="senhaRepeticao" onChange={e => this.setState({
                                            senhaRepeticao: e.target.value
                                        })} />
                                </FormGroup>
                                <button type="button" className="btn btn-success" onClick={this.cadastrar}>Salvar</button>
                                <button type="button" onClick={this.cancelar} className="btn btn-danger">Voltar</button>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

}

export default withRouter(CadastroUsuario) 