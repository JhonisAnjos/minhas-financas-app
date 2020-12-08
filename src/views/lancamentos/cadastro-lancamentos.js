import React from 'react'
import { withRouter } from 'react-router-dom'
import LancamentoService from '../../app/service/lancamentoService'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import * as messages from '../../components/toastr'
import LocalStorageService from '../../app/service/localStorageService'

class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        valor: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false
    }

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    componentDidMount() {
        const params = this.props.match.params
        if (params.id) {
            this.service.obterPorId(params.id)
                .then(response => {
                    this.setState({ ...response.data, atualizando: true })
                })
                .catch(error => {
                    messages.mensagemErro(error.response.data)
                })
        }


    }

    submit = () => {

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        const { descricao, valor, mes, ano, tipo } = this.state;

        const lancamento = {
            descricao,
            valor,
            mes,
            ano,
            tipo,
            usuario: usuarioLogado.id
        }

        try {
            this.service.validar(lancamento)
        } catch (erro) {
            const mensagens = erro.mensagens;
            mensagens.forEach(element => {
                messages.mensagemErro(element)
            });
            return false;
        }

        this.service.salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento cadastrado.')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            });

        console.log(this.state);
    }

    atualizar = () => {

        const { id,
            descricao,
            valor,
            mes,
            ano,
            tipo,
            status,
            usuario } = this.state;

        const lancamento = {
            id,
            descricao,
            valor,
            mes,
            ano,
            tipo,
            status,
            usuario
        }

        this.service.atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento atualizado.')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            });


    }

    render() {

        const tipos = this.service.obterListaTipos();
        const meses = this.service.obterListaMeses();

        return (
            <Card title={this.state.atualizando?'Atualização de Lançamento':'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-lg-12">
                        <FormGroup htmlFor="inputDescricao" label="Descrição: *">
                            <input type="text" id="inputDescricao" className="form-control" name="descricao" value={this.state.descricao} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <FormGroup htmlFor="inputAno" label="Ano: *">
                            <input type="text" className="form-control" id="inputAno" name="ano" value={this.state.ano} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-lg-6">
                        <FormGroup htmlFor="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes" lista={meses} className="form-control" name="mes" value={this.state.mes} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <FormGroup htmlFor="inputValor" label="Valor: *">
                            <input id="inputValor" type="text" className="form-control" name="valor" value={this.state.valor} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-lg-4">
                        <FormGroup htmlFor="inputTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo" lista={tipos} className="form-control" name="tipo" value={this.state.tipo} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-lg-4">
                        <FormGroup htmlFor="inputStatus" label="Status: ">
                            <input type="text" id="inputStatus" className="form-control" disabled name="status" value={this.state.status} />
                        </FormGroup>
                    </div>
                </div>
                {this.state.atualizando?(
                    <button type="button" className="btn btn-primary" onClick={this.atualizar}>Atualizar</button>
                ):(
                    <button type="button" className="btn btn-success" onClick={this.submit}>Salvar</button>
                )}
                <button type="button" className="btn btn-danger" onClick={e => { this.props.history.push('/consulta-lancamentos') }}>Cancelar</button>
            </Card>
        )
    }

}

export default withRouter(CadastroLancamentos)