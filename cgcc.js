// constantes do curso
export const TOTAL_CREDITOS = 218;
export const CREDITOS_COMPLEMENTARES = 22;
export const MAX_PERIODOS = 14;
export const MIN_MATRICULA = 16;
export const MAX_MATRICULA = 24;
export const NUM_SEMESTRES = 9;
export const PACE_IDEAL = (TOTAL_CREDITOS - CREDITOS_COMPLEMENTARES) / NUM_SEMESTRES;
export const EXTRA_CONCLUINTE = 4;
export const NOVO_CREDITOS_COMPLEMENTARES = 8;
export const NOVO_CREDITOS_DE_EXTENSAO = 22;


// constantes da transição
export const PERIODOS_RESTANTES = 5;

// abaixo deste valor, o aluno DEVE migrar (não tem tempo para concluir)
export const MAX_POSSIVEL = PERIODOS_RESTANTES * MAX_MATRICULA + EXTRA_CONCLUINTE;

// acima deste valor, o aluno NÃO DEVE migrar (terá trabalho extra)
export const CREDITOS_DISCIPLINAS = TOTAL_CREDITOS - CREDITOS_COMPLEMENTARES;

// valores intermediários (heurísticas de Fubica)
export const LIMIAR1 = 96;
export const LIMIAR2 = 170;

// funções memória de cálculo
export function calculo_pace(completed, num_periodos_cursados) {
    let pace_real = completed / num_periodos_cursados;

    if (pace_real > MAX_MATRICULA) {
        // limita a PACE_IDEAL, pra alunos que aproveitaram disciplinas
        pace_real = PACE_IDEAL;
    }
    // o pace é limitado ainda pela regulamentação de matrículas 
    return Math.max(pace_real, MIN_MATRICULA);
}

export function calculo_projected(completed, num_periodos_cursados) {
    let pace = calculo_pace(completed, num_periodos_cursados);
    return PERIODOS_RESTANTES * pace + completed;
}

export function calculo_creditos_faltantes(completed) {
    return TOTAL_CREDITOS - completed - CREDITOS_COMPLEMENTARES;
}

window.cs = classifica_situacao;
export function classifica_situacao(completed, num_periodos_cursados) {
    let creditos_a_cursar = calculo_creditos_faltantes(completed);
    let projected = calculo_projected(completed, num_periodos_cursados);

    if (num_periodos_cursados >= 9) {
        console.log(0);
        return `não vai migrar I`;
    }
    else if (creditos_a_cursar > MAX_POSSIVEL) {
        console.log(1);
        return 'tem que migrar';
    }
    else if (completed > LIMIAR1 &&  projected >= CREDITOS_DISCIPLINAS) {
        console.log(2);
        return `não vai migrar II`;
    }
    else if (completed <= LIMIAR1 && projected >= CREDITOS_DISCIPLINAS)  {
        console.log(3);
        return `provavelmente não vai migrar`;
    }
    else if (completed > LIMIAR1 && (projected > LIMIAR2 && projected < CREDITOS_DISCIPLINAS)) {
        console.log(4);
        return `provavelmente não vai migrar`;
    }
    else if (completed <= LIMIAR1 && projected < CREDITOS_DISCIPLINAS) {
        console.log(5);
        return `provavelmente vai migrar`;
    }
    else if (projected < LIMIAR2) {
        console.log(6);
        return `provavelmente vai migrar`;
    }
        console.log(7);
    return `situação indefinida`;
}
