import {
    TOTAL_CREDITOS,
    PERIODOS_RESTANTES,
    CREDITOS_COMPLEMENTARES,
    LIMIAR1,
    LIMIAR2,
    LIMIAR3,
    LIMIAR4,
    MAX_MATRICULA,
    MAX_POSSIVEL,
    calculo_pace,
    calculo_projected,
    calculo_creditos_faltantes,
    classifica_situacao
} from './cgcc.js';

let $completed = document.querySelector("#completed");
let $projected = document.querySelector("#projected");
let $message = document.querySelector("#message");
let $periodos = document.querySelector("#periodos");
let $pace = document.querySelector("#pace");
let $acursar = document.querySelector("#acursar");
let $max_acursar = document.querySelector("#max-acursar");

$periodos.focus();

function update() {
    let completed = Number($completed.value);
    let num_periodos_cursados = Number($periodos.value);
    let pace = calculo_pace(completed, num_periodos_cursados);

    if (!$completed.value || !$periodos.value) {
        $pace.value = "";
        $projected.value = "";
        $message.innerHTML = "";
        return;
    }

    // atualiza pace
    if (Number.isFinite(pace)) {
        $pace.value = pace.toFixed(1);
    } else {
        $pace.value = "";
    }

    // atualiza projected
    //let projected = pace * PERIODOS_RESTANTES + completed;
    let projected = calculo_projected(completed, PERIODOS_RESTANTES);
    if (Number.isFinite(projected)) {
        $projected.value = Math.trunc(projected);
    } else {
        $projected.value = "";
    }

    // atualiza creditos_a_cursar
    let creditos_a_cursar = calculo_creditos_faltantes(completed);
    $acursar.value = creditos_a_cursar;

    let situacao = classifica_situacao(completed, num_periodos_cursados);
    console.log(situacao);
    let debug = '?';
    switch (situacao) {
        case 'tem que migrar':
            $message.innerHTML = `
                <pre>tem que migrar <br>(creditos_a_cursar > ${MAX_POSSIVEL})</pre>
                <p>
                    Você <b>DEVE MIGRAR</b> para o novo currículo.
                    Você só acumulou ${completed} créditos
                    até o momento. Logo, ainda precisa acumular, no mínimo,
                    mais ${creditos_a_cursar} créditos para concluir o curso.
                    Como o máximo de créditos que se pode matricular 
                    por semestre é de ${MAX_MATRICULA}, é
                    matematicamente impossível que você conclua o que ainda
                    falta do curso em ${PERIODOS_RESTANTES} semestres
                    (lembre que 2025.2 é o último semestre
                    para concluir com a grade antiga).
                </p>`;
            break;

        case 'vai migrar':
            debug = 
                `<pre>vai migrar<br>` + 
                `((completed > ${LIMIAR1} && completed <= ${LIMIAR2} && projected < ${LIMIAR4}) || projected < ${LIMIAR3})</pre>`;
            $message.innerHTML = `
                ${debug}
                <p>
                    Orientação ainda a ser escrita para esta categoria.
                </p>`;
            break;

        case 'é possível que vá migrar (mas não deve migrar já)':
            debug = 
                `<pre>é possível que vá migrar (mas não deve migrar já)<br>` + 
                `(completed <= ${LIMIAR2} && projected >= ${LIMIAR4})</pre>`;
            $message.innerHTML = `
                ${debug}
                <p>
                    Orientação ainda a ser escrita para esta categoria.
                </p>`;
            break;

        case 'provavelmente não vai migrar':
            debug = 
                `<pre>provavelmente não vai migrar<br>` +
                `completed = ${completed}<br>` + 
                `projected = ${projected}<br>` +
                `(projected > ${LIMIAR2} && (projected > ${LIMIAR3} && projected < ${LIMIAR4}))</pre>`;
            $message.innerHTML = 
                `${debug}
                <p>
                    Orientação ainda a ser escrita para esta categoria.
                </p>`;
            break;

        case 'não vai migrar I':
            debug = 
                `<pre>não vai migrar I<br>` + 
                `(periodos >= 9)</pre>`;
            $message.innerHTML = 
                `${debug}
                <p>
                    Você <b>NÃO DEVE MIGRAR</b> para a nova grade.
                    Você precisa concluir o curso antes de 2025.2,
                    porque você só tem mais 
                    ${14 - num_periodos_cursados} períodos para concluir o curso.
                </p>`;
            break;


        case 'não vai migrar II':
            debug = 
                `<pre>não vai migrar II<br>` + 
                `(completed > ${LIMIAR2} && projected >= ${LIMIAR4})</pre>`;
            $message.innerHTML = 
                `${debug}
                <p>
                    Você <b>NÃO DEVE MIGRAR</b> para a nova grade.
                    Objetivamente, não há motivos pra você migrar.
                    Pelos dados, você tem condições de concluir o curso
                    ${PERIODOS_RESTANTES} semestres ou menos. Dito isso,
                    é importante que você esteja atento a algumas coisas
                    nas próximas matrículas.
                </p>
                <ol>

                    <li>Certifique-se que vai conseguir acumular mais
                    ${creditos_a_cursar} créditos nos próximos
                    ${PERIODOS_RESTANTES} semestres. Não basta
                    matricular! Precisa passar nas disciplinas e
                    acumular os créditos.</li>

                    <li>Certifique-se que vai conseguir acumular o
                    mínimo de ${CREDITOS_COMPLEMENTARES} créditos em
                    <b>atividades complementares flexíveis</b>. Observe
                    que algumas atividades complementares flexíveis não
                    são atividades acadêmicas de extensão e podem não
                    contar como créditos válidos, no caso de você
                    precisar migrar no futuro. O mais sensato é
                    priorizar, a partir de agora, atividades acadêmicas
                    de extensão, já que têm validade em ambos os
                    currículos.</li>

                    <li>Se por qualquer motivo (até mesmo de força
                    maior, como casos de saúde, por exemplo) você não
                    conseguir concluir o curso até 2025.2, no semestre
                    2026.1 você será <b>automaticamente migrado para a
                    nova grade</b>. E isso significará que você terá que
                    cumprir todas as exigências da nova grade e não mais
                    da antiga.</li>
                </ol>`;
            break;

        case 'situação indefinida':
        default:
            $message.innerHTML = `Ops... não sei dizer... procure a coordenação, por favor.`;
            break;
    }
}

window.addEventListener("keyup", update);
