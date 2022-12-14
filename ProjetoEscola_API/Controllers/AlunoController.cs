using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjetoEscola_API.Data;
using ProjetoEscola_API.Models;

namespace ProjetoEscola_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlunoController : Controller
    {
        private readonly EscolaContext _context;
        public AlunoController(EscolaContext context)
        {
            //construtor
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Aluno>> GetAll()
        {
            if (_context.Aluno is not null) {
                return _context.Aluno.ToList();
            }
            else {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                "Falha no acesso ao banco de dados.");
            }
        }
        [ActionName("AlunoId")]
        [HttpGet("{AlunoId}")]
        public ActionResult<List<Aluno>> Get(int AlunoId)
        {
            try
            {
                var result = _context.Aluno.Find(AlunoId);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                "Falha no acesso ao banco de dados.");
            }
        }

        [ActionName("AlunoNome")]
        [HttpGet("{AlunoNome}")]
        public ActionResult<List<Aluno>> GetAlunoNome(string AlunoNome)
        {
            if (_context.Aluno is not null) {
                var result = _context.Aluno.Where(a => a.nome == AlunoNome);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            else
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                "Falha no acesso ao banco de dados.");
            }
        }

        [HttpPost]
        public async Task<ActionResult> post(Aluno model)
        {
            try
            {
                _context.Aluno.Add(model);
                if (await _context.SaveChangesAsync() == 1)
                {
                    //return Ok();
                    return Created($"/api/aluno/{model.ra}", model);
                }
            }
            catch
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                "Falha no acesso ao banco de dados.");
            }
            // retorna BadRequest se n??o conseguiu incluir
            return BadRequest();
        }

        [HttpPut("{AlunoId}")]
        public async Task<ActionResult> put(int AlunoId, Aluno dadosAlunosAlt)
        {
             try
            {
                //verifica se existe aluno a ser exclu??do
                var result = await _context.Aluno.FindAsync(AlunoId);
                if (AlunoId != result.id)
                {
                    return BadRequest();
                }
                result.ra = dadosAlunosAlt.ra;
                result.nome = dadosAlunosAlt.nome;
                result.codCurso = dadosAlunosAlt.codCurso;
                await _context.SaveChangesAsync();
                return Created($"api/aluno/{dadosAlunosAlt.ra}", dadosAlunosAlt);
            }
            catch
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                "Falha no acesso ao banco de dados.");
            }
        }

        [HttpDelete("{AlunoId}")]
        public async Task<ActionResult> delete(int AlunoId)
        {
            try
            {
                //verifica se existe aluno a ser exclu??do
                var aluno = await _context.Aluno.FindAsync(AlunoId);
                if (aluno == null)
                {
                    //m??todo do EF
                    return NotFound();
                }
                _context.Remove(aluno);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                "Falha no acesso ao banco de dados.");
            }
        }
    }
}