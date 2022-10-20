import React from "react";
import './carometro.css'
import { useState, useEffect } from "react";
import Main from "../template/Main";
import axios from "axios";

const title = 'Carômetro'
const urlAPIAlunos = 'http://localhost:5014/api/aluno';
const urlAPICursos = 'http://localhost:5014/api/curso';
const infos = {
    cursos: { id: 0, codCurso: '', nomeCurso: '', periodo: ''},
    listaAlunos: [],
    listaCursos: []
}

const geradorDeLetras = () => {
    return Math.random().toString(36).substring(2, 9);
}

export default function Carometro(props) {

    const [listaAlunos, setListaAlunos] = useState(infos.listaAlunos)
    const [listaCursos, setListaCursos] = useState(infos.listaCursos)
    const [cursos, setCursos] = useState(infos.cursos)

    useEffect( () => {
        axios(urlAPICursos)
            .then((resp) => setListaCursos(resp.data))
    }, []);

    const getAlunosCadastrados = async (codCurso) => {
        return await axios(urlAPIAlunos)
                        .then((resp) => {
                            const listaAlunos = resp.data
                            return listaAlunos.filter(
                                (alunos) => alunos.codCurso === codCurso
                            )
                        })
    }

    const atualizarAlunos = async (evento) => {
        const codCurso = evento.target.value;
        if (evento.target.value === '') {
            setListaAlunos(infos.listaAlunos)
            setCursos(infos.cursos)
            return
        }
        cursos.codCurso = Number(codCurso)
        const listaAlunos = await getAlunosCadastrados(cursos.codCurso)
        if (!Array.isArray(listaAlunos)) return;

        setListaAlunos(listaAlunos)
        setCursos(cursos)
    }

    const renderSelect = () => {
        return (
            <div className="select-container">
                <label> Curso: </label>
                <select className="selectCarometro" value={cursos.codCurso}  onChange={e => { atualizarAlunos(e)}} required>
                    <option disabled={true} key="" value="">  -- Escolha um curso -- </option>
                    {listaCursos.map( (cursos) =>
                            <option  key={cursos.id} name="codCurso" value={cursos.codCurso}>
                                { cursos.codCurso } - { cursos.nomeCurso } : { cursos.periodo }
                            </option>
                    )}
                </select>
            </div>
        );
    };

    const renderCards = () =>(
        <div className="card-row">
            {Array.isArray(listaAlunos) && listaAlunos.length > 0 ?
            listaAlunos.map((aluno) => (
                <div key={aluno.id} className="card draw-border">
                    <img  className="card-imagem" src={`https://avatars.dicebear.com/api/big-smile/${geradorDeLetras()}.svg`} alt={`Avatar de `+ aluno.nome}/>
                    <span className="card-titulo">{aluno.nome}</span>
                    <span className="card-descricao">RA: {aluno.ra}</span>
                    <span className="card-descricao"> Curso: {aluno.codCurso} </span>
                </div>
            )) : null}
        </div>
    )

    return (
        <div className="container carometro">
            <Main title={title}>
                {renderSelect()}
                <main>
                    <div className="card-container">
                        {renderCards()}
                    </div>
                </main>
            </Main>
        </div>
    )
}