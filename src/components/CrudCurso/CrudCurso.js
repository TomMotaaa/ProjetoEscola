import React from "react";
import './CrudCurso.css'
import { useState, useEffect } from "react";
import Main from "../template/Main";
import axios from "axios";

const urlAPI = 'http://localhost:5014/api/curso'
const title = 'Cadastro de Cursos'
const initialState = {
    curso: {id: 0, codCurso: 0, nomeCurso: '', periodo: ''},
    lista: []
}

export default function Curso() {
    const [curso, setCurso] = useState(initialState.curso)
    const [lista, setLista] = useState(initialState.lista)

    const dadosAPI = async () => {
        await axios(urlAPI).then((resp) => resp.data).catch((err) => err)
    }

    useEffect(() => {
        dadosAPI()
            .then(setLista)
    }, [curso])

    const limpar = () => {
        setCurso({ curso: initialState.curso })
    }

    const salvar = () => {
        curso.codCurso = Number(curso.codCurso)
        const metodo = curso.id ? 'put' : 'post'
        const url = curso.id ? `${urlAPI}/${curso.id}` : urlAPI

        axios[metodo] (url, curso)
            .then((resp) => {
                const lista = getListaAtualizada(resp.data)
                setCurso({ curso: initialState.curso, lista})
            })
    }

    const getListaAtualizada = (curso, add = true) => {
        const listaAtualizada = lista.filter(a => a.id !== curso.id);
        if(add) listaAtualizada.unshift(curso);
        return listaAtualizada;
    }

    const atualizaCampo = (evento) => {
        const {nome, valor} = evento.target
        setCurso({
            ...curso,
            [nome] : valor
        })
    }

    const carregar = (curso) => {
        setCurso(curso)
    }

    const remover = (curso) => {
        const url = urlAPI + "/" + curso.id;
        if (window.confirm("Confirma remoção do aluno: " + curso.nomeCurso)) {
            console.log("entrou no confirme da tela")
        
        axios['delete'] (url, curso)
            .then((resp) => {
                const lista = getListaAtualizada(curso, false)
                setCurso({ curso: initialState.curso, lista })
            })
    }

    const renderForm = () => {
        return (
                <div className="inclui-container">
                    <label> Código do Curso: </label>
                    <input
                        type="number"
                        id="codCurso"
                        placeholder="Codigo"
                        className="form-input"
                        name="codCurso"
    
                    value={curso.codCurso}
                    onChange={(e) => atualizaCampo(e)}
                    />
                    <label> Curso: </label>
                    <input
                        type="text"
                        id="nome"
                        placeholder="Curso"
                        className="form-input"
                        name="nomeCurso"
    
                    value={curso.nomeCurso}
                    onChange={(e) => atualizaCampo(e)}
                    />
                    <label> Período: </label>
                    <input
                        type="text"
                        id="codCurso"
                        placeholder="Periodo"
                        className="form-input"
                        name="periodo"
    
                    value={curso.periodo}
                    onChange={(e) => atualizaCampo(e)}
                    />
                    <button className="btnSalvar"
                    onClick={salvar}
                    >
                        Salvar
                    </button>
                    <button className="btnCancelar"
                    onClick={limpar} 
                    >
                        Cancelar
                    </button>
                </div>
        )    
    }

    const renderTable = () => {
        <div className="listagem">
                <table className="listaCursos" id="tblListaCursos">
                    <thead className='cabecTabela'>
                        <tr className="cabecTabela">
                            <th className='tabTituloNome'>Código </th>
                            <th className='tabTituloCodCurso'>Curso</th>
                            <th className='tabTituloPeriodo'>Período</th>
                        </tr>
                    </thead>

                    <tbody>
                        {lista.map(
                            (curso) =>
                                <tr key={curso.id}>
                                    <td className="val-center">{curso.nomeCurso}</td>
                                    <td>{curso.codCurso}</td>
                                    <td className="val-center">{curso.periodo}</td>
                                    <td>
                                        <button className='btn-alterar'
                                        onClick={() => carregar(curso)}
                                        >
                                            Alterar
                                        </button>
                                    </td>
                                    <td>
                                        <button className='btn-remover'
                                        onClick={() => remover(curso)}
                                        >
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                        )}
                    </tbody>
                </table>
            </div>
    }

    return (
        <Main title={title}>
                {renderForm()}
                {renderTable()}
        </Main>
    )
}}