import React from 'react'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LançamentoTable from './lancamentoTable'
import { withRouter } from 'react-router-dom'
import LançamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';



class ConsultaLancamentos extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.service = new LançamentoService();
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
                .then(response => {
                    const lancamentos = this.state.lancamentos;
                    const index = lancamentos.indexOf(lancamento);
                    if(index !== -1){
                        lancamento['status'] = status;
                        lancamentos[index] = lancamento;
                        this.setState({lancamentos});

                        messages.mensagemSucesso("Status atualizado.")
                    }
                })
    }


    abrirConfirmacao = (lancamento) => {
        this.setState({ showConfirmDialog: true, lancamentoDeletar: lancamento })
    }

    cancelarDeletar = () =>{
        this.setState({ showConfirmDialog: false, lancamentoDeletar: {} })
    }

    deletar = () => {
        this.service.deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos
                const index = lancamentos.indexOf(this.state.lancamentoDeletar)
                lancamentos.splice(index.splice, 1);
                this.setState({ showConfirmDialog: false, lancamentoDeletar: {}, lancamentos: lancamentos })
                messages.mensagemSucesso('Lançamento deletado com sucesso.')
            }).catch(erro => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o Lançamento')
            })
    }


    preparaFormularioCadastrar = () =>{
        this.props.history.push('/cadastro-lancamentos')
    }

    buscar = () => {
        if (!this.state.ano) {
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório.')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            descricao: this.state.descricao,
            tipo: this.state.tipo,
            usuario: usuarioLogado.id
        }

        this.service.consultar(lancamentoFiltro)
            .then(response => {
                const lista = response.data;
                if(lista < 1){
                    messages.mensagemAlerta("Nenhum resultado encontrado.")
                }
                this.setState({ lancamentos: lista })
            }).catch(error => {
                console.log(error.response)
            })

    }


    render() {

        const meses = this.service.obterListaMeses();

        const tipos = this.service.obterListaTipos();

        const footerConfirmDialog = (
            <div>
                <Button label="Sim" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Não" icon="pi pi-times" onClick={this.cancelarDeletar} />
            </div>
        );


        return (
            <Card title="Buscar Lançamentos">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="bs-component">
                            <fieldset>
                                <FormGroup label="Ano: *" htmlFor="InputAno">
                                    <input type="text" className="form-control" id="InputAno" value={this.state.ano}
                                        onChange={e => this.setState({ ano: e.target.value })} placeholder="Digite o Ano" />
                                </FormGroup>
                                <FormGroup htmlFor="inputMes" label="Mês: ">
                                    <SelectMenu className="form-control" id="inputMes"
                                        value={this.state.mes}
                                        onChange={e => this.setState({ mes: e.target.value })} lista={meses} />
                                </FormGroup>
                                <FormGroup label="Descrição: *" htmlFor="InputDesc">
                                    <input type="text" className="form-control" id="InputDesc" value={this.state.descricao}
                                        onChange={e => this.setState({ descricao: e.target.value })} placeholder="Digite a descrição" />
                                </FormGroup>
                                <FormGroup htmlFor="inputTipo" label="Tipo de Lançamento: ">
                                    <SelectMenu className="form-control" id="inputTipo" value={this.state.tipo}
                                        onChange={e => this.setState({ tipo: e.target.value })} lista={tipos} />
                                </FormGroup>
                                <button type="button" onClick={this.buscar} className="btn btn-success"><i className="pi pi-search"></i> Buscar</button>
                                <button type="button" className="btn btn-danger" onClick={this.preparaFormularioCadastrar}><i className="pi pi-plus"/> Cadastrar</button>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <LançamentoTable lancamentos={this.state.lancamentos} editAction={this.editar} deleteAction={this.abrirConfirmacao}
                            alterarStatus={this.alterarStatus} />

                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Header"
                        footer={footerConfirmDialog}
                        visible={this.state.showConfirmDialog}
                        style={{ width: '50vw' }}
                        modal={true}
                        onHide={() => this.setState({ showConfirmDialog: false })}>
                        <p>Confirma a exclusão deste lançamento?</p>
                    </Dialog>
                </div>
            </Card>
        )
    }

}

export default withRouter(ConsultaLancamentos)