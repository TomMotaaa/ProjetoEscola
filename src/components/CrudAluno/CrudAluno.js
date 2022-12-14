import React, {Component} from "react";
import axios from 'axios';
import './CrudAluno.css';
import Main from "../template/Main";

const title = "Cadastro de Alunos";

const urlAPI = 'http://localhost:5014/api/aluno';
const urlAPICurso = 'http://localhost:5014/api/curso';
const initialState = {
    aluno: { id: 0, ra: '', nome: '', codCurso: 0},
    lista: [],
    listaCurso: []
}

export default class CrudAluno extends Component {

    state = { ...initialState}

    componentDidMount() {
        axios(urlAPI).then(resp => {
            this.setState({ lista: resp.data })
        })

        axios(urlAPICurso).then(resp => {
            this.setState({ listaCurso: resp.data })
        })
    }

    limpar() {
        this.setState({ aluno: initialState.aluno });
    }

    salvar() {
        const aluno = this.state.aluno;
        aluno.codCurso = Number(aluno.codCurso);
        const metodo = aluno.id ? 'put' : 'post';
        const url = aluno.id ? `${urlAPI}/${aluno.id}` : urlAPI;

        axios[metodo](url, aluno)
            .then(resp => {
                const lista = this.getListaAtualizada(resp.data)
                this.setState({ aluno: initialState.aluno, lista })
            })
    }

    getListaAtualizada(aluno, add = true) {
        const lista = this.state.lista.filter(a => a.id !== aluno.id);
        if (add) lista.unshift(aluno);
        return lista;
    }

    atualizaCampo(evento) {
        //clonar usuário a partir do state, para não alterar o state diretamente
        const aluno = { ...this.state.aluno};
        // usar o atributo NAME do imput identificar o campo a ser atualizado
        aluno[evento.target.name] = evento.target.value;
        //atualizar o state
        this.setState({aluno});
    }

    carregar(aluno) {
        this.setState({ aluno })
        const url = urlAPI + "/" + aluno.id;
        if (window.confirm("Confirma edição do aluno: " + aluno.ra)) {
            console.log("entrou no confirm");
            axios['PUT'](url, aluno).then(resp => {
                const lista = this.getListaAtualizada(aluno, false);
                this.setState({ aluno: initialState.aluno, lista });
            });
        }
        this.atualizaCampo(aluno);
    }

    remover(aluno) {
        const url = urlAPI + "/" + aluno.id;
        if (window.confirm("Confirma remoção do aluno: " + aluno.ra)) {
            console.log("entrou no confirme da tela")

            axios['delete'](url, aluno)
                .then(resp => {
                    const lista = this.getListaAtualizada(aluno, false)
                    this.setState({ aluno: initialState.aluno, lista })
                })
        }
    }

    renderForm() {
        return (
            <div className="inclui-container">

                <label> RA: </label>
                <input
                    type="text"
                    id="ra"
                    placeholder="RA do aluno"
                    className="form-input"
                    name="ra"
                    value={this.state.aluno.ra}
                    onChange={ e => this.atualizaCampo(e)}
                />

                <label> Nome: </label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Nome do aluno"
                    className="form-input"
                    name="nome"
                    value={this.state.aluno.nome}
                    onChange={ e => this.atualizaCampo(e)}
                />

                <label> Curso: </label>
                <select name="codCurso" onChange={e => {this.atualizaCampo(e)}}>
                    {this.state.listaCurso.map (
                        (curso) => 
                            <option
                                name="codCurso"
                                value={curso.codCurso}
                            >
                                {curso.nomeCurso}
                            </option>
                    )}
                </select>

                <button className="btnSalvar"
                    onClick={e => this.salvar(e)} >
                        Salvar
                </button>

                <button className="btnCancelar"
                    onClick={e => this.limpar(e)} >
                        Cancelar
                </button>

            </div>
        )
    }

    renderTable() {
        return(
            <div className="listagem">
                <table className="listaAlunos" id="tblListaAlunos">
                    <thead>
                        <tr className="cabecTabela">
                            <th className="tabTituloRa">RA</th>
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloNumCurso">Curso</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.lista.map(
                            (aluno) =>
                            <tr key={aluno.id}>
                                <td className="val-center">{aluno.ra}</td>
                                <td className="val-center">{aluno.nome}</td>
                                <td className="val-center">{aluno.codCurso}</td>
                                <td>
                                    <button className="btn-alterar" onClick={() => this.carregar(aluno)}>
                                        Alterar
                                    </button>
                                </td>
                                <td>
                                    <button className="btn-remover" onClick={() => this.remover(aluno)}>
                                        Remover
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
    render() {
        return(
            <Main title={title}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}