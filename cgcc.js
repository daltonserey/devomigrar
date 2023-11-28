// constantes do curso
export const TOTAL_CREDITOS = 218;
export const CREDITOS_COMPLEMENTARES = 22;
export const MIN_MATRICULA = 16;
export const MAX_MATRICULA = 24;
export const NUM_SEMESTRES = 9;
export const PACE_IDEAL = (TOTAL_CREDITOS - CREDITOS_COMPLEMENTARES) / NUM_SEMESTRES;
export const EXTRA_CONCLUINTE = 4;


// constantes da transição
export const PERIODOS_RESTANTES = 5;
export const MAX_POSSIVEL = PERIODOS_RESTANTES * MAX_MATRICULA;

// abaixo deste valor, o aluno DEVE migrar (não tem tempo para concluir)
export const LIMIAR1 = PERIODOS_RESTANTES * MAX_MATRICULA + EXTRA_CONCLUINTE;

// acima deste valor, o aluno NÃO DEVE migrar (terá trabalho extra)
export const LIMIAR4 = TOTAL_CREDITOS - CREDITOS_COMPLEMENTARES;

// valores intermediários (heurísticas de Fubica)
export const LIMIAR2 = 96;
export const LIMIAR3 = 170;

// funções memória de cálculo
export function calculo_pace(completed, num_periodos_cursados) {
    let pace_real = completed / num_periodos_cursados;

    if (pace_real > MAX_MATRICULA) {
        // limita a PACE_IDEAL, pra alunos que aproveitaram disciplinas
        pace_real = PACE_IDEAL;
    }
    // o pace é limitado ainda pela regulamentação de matrículas 
    return Math.max(Math.min(pace_real, MAX_MATRICULA), MIN_MATRICULA);
}

export function calculo_projected(completed, num_periodos_cursados) {
    let pace = calculo_pace(completed, num_periodos_cursados);
    return PERIODOS_RESTANTES * pace + completed;
}

export function calculo_creditos_faltantes(completed) {
    return TOTAL_CREDITOS - completed;
}

export function classifica_situacao(completed, num_periodos_cursados) {
    let creditos_a_cursar = calculo_creditos_faltantes(completed);
    let projected = calculo_projected(completed, num_periodos_cursados);

    if (num_periodos_cursados >= 9) {
        return `não vai migrar I`;
    }
    else if (creditos_a_cursar > MAX_POSSIVEL) {
        return 'tem que migrar';
    }
    else if ((completed > LIMIAR1 && completed <= LIMIAR2 && projected < LIMIAR4) || projected < LIMIAR3) {
        return `vai migrar`;
    }
    else if (completed <= LIMIAR2 && projected >= LIMIAR4)  {
        return `é possível que vá migrar (mas não deve migrar já)`;
    }
    else if (completed > LIMIAR2 && (projected > LIMIAR3 && projected < LIMIAR4)) {
        return `provavelmente não vai migrar`;
    }
    else if (completed > LIMIAR2 &&  projected >= LIMIAR4) {
        return `não vai migrar II`;
    }
    return `situação indefinida`;
}
