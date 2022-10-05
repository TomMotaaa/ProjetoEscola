import React from "react";
import './CrudCurso.css'
import { useState, useEffect } from "react";
import Main from "../template/Main";
import axios from "axios";

export default function Cursos() {
    const title = "Cadastro de Cursos"
    const urlAPI = 'http://localhost:5014/api/curso';
    const [data, setData] = useState([])
    const [lista, setLista] = useState({
        id: 0,
        codCurso: '',
        nomeCurso: '',
        periodo: '',
    })
    const [cursoData, setCurso] = useState({
        id: 0,
        codCurso: '',
        nomeCurso: '',
        periodo: '',
    })

    const InfoAPI = async () => {
        await axios(urlAPI)
            .then(resp => {
                setData(resp.data)
            })
    }


    const atualizaCampo = evento => {
        const { name, value } = evento.target
        setCurso({
            ...cursoData,
            [name]: value
        })
        console.log(cursoData)
    }

    const getListaAtualizada = (curso, add = true) =>{
        const listaAtualizada = lista.filter(a => a.id !== curso.id)
        if(add) listaAtualizada.unshift(curso)
        return listaAtualizada
    }

    function salvar () {
        const dadosCurso = cursoData
        cursoData.codCurso = Number(dadosCurso.codCurso)
        const metodo = cursoData.id ? 'put' : 'post'
        const url = cursoData.id ? `${urlAPI}/${dadosCurso.id}` : urlAPI

        axios[metodo](url, dadosCurso)
        .then(resp => {
            let lista = getListaAtualizada(resp.data)
            cursoData({ dadosCurso: cursoData.dadosCurso, lista})
            setLista(lista)
        })
    }

    const atualizarCurso = (cursoData) => setCurso(cursoData)

    const removerCurso = (cursoData) => {
        const url = urlAPI + '/' + cursoData.id;
        if (!window.confirm("Confirmae remoção do curso: " + cursoData.nomeCurso)) return;

        axios['delete'](url, cursoData)
            .then((_resp) => {
                const lista = getListaAtualizada(cursoData, false)
                setCurso({ dadosCurso: cursoData.dadosCurso, lista })
            })
    }



    useEffect(() => {
        InfoAPI()
    }, [data])


    return (
        <Main title={title}>
            <div className="inclui-container">
                <label> Código do Curso: </label>
                <input
                    type="number"
                    id="ra"
                    placeholder="Codigo"
                    className="form-input"
                    name="codCurso"

                value={cursoData.codCurso}
                onChange={atualizaCampo}
                />
                <label> Curso: </label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Curso"
                    className="form-input"
                    name="nomeCurso"

                value={cursoData.nomeCurso}
                onChange={atualizaCampo}
                />
                <label> Período: </label>
                <input
                    type="text"
                    id="codCurso"
                    placeholder="Periodo"
                    className="form-input"
                    name="periodo"

                value={cursoData.periodo}
                onChange={atualizaCampo}
                />
                <button className="btnSalvar"
                onClick={salvar}
                >
                    Salvar
                </button>
                <button className="btnCancelar"
                //onClick={e => this.limpar(e)} 
                >
                    Cancelar
                </button>
            </div>

            <div className="listagem">
                <table className="listaCursos" id="tblListaCursos">
                    <thead className='cabecTabela'>
                        <tr className="cabecTabela">
                            <th className='tabTituloCurso'>Curso</th>
                            <th className='tabTituloCodCurso'>Código</th>
                            <th className='tabTituloPeriodo'>Período</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map(
                            (curso) =>
                                <tr key={curso.id}>
                                    <td>{curso.nomeCurso}</td>
                                    <td>{curso.codCurso}</td>
                                    <td className="val-center">{curso.periodo}</td>
                                    <td>
                                        <button className='btn-alterar'
                                            onClick={() => atualizarCurso(curso)}
                                        >
                                            Alterar
                                        </button>
                                    </td>
                                    <td>
                                        <button className='btn-remover'
                                            onClick={() => removerCurso(curso)}
                                        >
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Main>
    )
}

