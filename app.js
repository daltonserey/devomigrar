import {
    TOTAL_CREDITOS,
    PERIODOS_RESTANTES,
    CREDITOS_COMPLEMENTARES,
    CREDITOS_DISCIPLINAS,
    LIMIAR1,
    LIMIAR2,
    MAX_MATRICULA,
    MAX_POSSIVEL,
    MAX_PERIODOS,
    NOVO_CREDITOS_COMPLEMENTARES,
    NOVO_CREDITOS_DE_EXTENSAO,
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
    let projected = calculo_projected(completed, num_periodos_cursados);
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
        case 'não vai migrar I':
            debug = `não vai migrar I<br>` + 
                    `(periodos >= 9)`;
            $message.innerHTML = `
                <h2>Orientação</h2>
                <pre>${debug}</pre>
                <p>
                    Você <b>NÃO DEVE MIGRAR</b> para a nova grade.
                    Você só tem mais ${MAX_PERIODOS - num_periodos_cursados}
                    períodos para concluir o curso, logo
                    você deve concluir o curso até 2025.2.
                </p>`;
            break;

        case 'não vai migrar II':
            debug = `não vai migrar II<br>` + 
                    `(completed > ${LIMIAR1} && projected >= ${CREDITOS_DISCIPLINAS})`;
            $message.innerHTML = `
                <h2>Orientação</h2>
                <pre>${debug}</pre>
                <p>
                    Você <b>NÃO DEVE MIGRAR</b> para a nova grade.
                    Objetivamente, não há motivos pra você migrar.
                    Pelos dados, você tem condições de concluir o curso
                    em ${PERIODOS_RESTANTES} períodos letivos ou menos.
                </p>

                <p>
                    Note que, ainda que a chance de você precisar migrar
                    seja muito remota, é muito importante que você
                    esteja atento às próximas matrículas e a sua
                    execução curricular.
                </p>

                <ol>
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
                    conseguir concluir o curso até 2025.2, no período
                    letivo
                    2026.1 você será <b>automaticamente migrado para a
                    nova grade</b>. E isso significará que você terá que
                    cumprir todas as exigências da nova grade e não mais
                    da antiga.</li>
                </ol>`;
            break;

        case 'provavelmente não vai migrar':
            debug = `provavelmente não vai migrar<br>` +
                    `(completed <= LIMIAR1 && projected >= CREDITOS_DISCIPLINAS)<br>` + 
                    ` ou (completed > LIMIAR1 && (projected > LIMIAR2 && projected < CREDITOS_DISCIPLINAS))`;
            $message.innerHTML = `
                <h2>Orientação</h2>
                <pre>${debug}</pre>
                <p>

                    Você <b>NÃO PRECISA MIGRAR AGORA</b>. Pelos dados,
                    você tem condições de concluir o curso em
                    ${PERIODOS_RESTANTES} períodos letivos ou menos.
                    Portanto, você pode concluir o curso até 2025.2 sem
                    a necessidade de migrar. Note que, mais adiante,
                    você pode identificar a necessidade de migrar. Se
                    isso ocorrer, você poderá solicitar sua migração
                    antes de cada matrícula até 2025.2. Antes de cada
                    matrícula até 2025.2, reconsidere a sua decisão de
                    migrar ou não com base nos novos dados disponíveis.

                </p>

                <p>

                    É importante que você esteja atento aos seguintes
                    pontos nas próximas matrículas e na sua execução
                    curricular.

                </p>

                <ol>

                    <li>Certifique-se que vai conseguir acumular mais
                    ${creditos_a_cursar} créditos em disciplinas nos
                    próximos ${PERIODOS_RESTANTES} períodos letivos.
                    Lembre-se: não basta se matricular! É preciso ser
                    aprovado nas disciplinas e acumular os
                    créditos.</li>

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
                    conseguir concluir o curso até 2025.2, no período
                    letivo
                    2026.1 você será <b>automaticamente migrado para a
                    nova grade</b>. E isso significará que você terá que
                    cumprir todas as exigências da nova grade e não mais
                    da antiga.</li>
                </ol>`;
            break;

        case 'provavelmente vai migrar':
            debug = `provavelmente vai migrar<br>` + 
                    `(completed <= ${LIMIAR1} && projected < ${CREDITOS_DISCIPLINAS})` + 
                    ` ou (projected < ${LIMIAR2})`;

            $message.innerHTML = `
                <h2>Orientação</h2>
                <pre>${debug}</pre>
                <p>

                    Você precisa acumular, no mínimo, mais
                    ${creditos_a_cursar} créditos para concluir o curso.
                    Matematicamente você pode concluir o curso em até
                    ${PERIODOS_RESTANTES} períodos letivos e, portanto,
                    você não precisa migrar para o novo currículo.

                    Contudo, fique atento! Seja por contratempos ou por
                    vontade própria, você pode terminar precisando concluir
                    após 2025.2. Nesse cenário você precisaria migrar
                    para o novo currículo.

                </p>

                <p>

                    A recomendação, no seu caso, é que você <b>MIGRE
                    SE IDENTIFICAR A NECESSIDADE</b>. Isso pode
                    ser feito agora ou antes da matrícula em qualquer um
                    dos períodos letivos até 2025.2. É importante que
                    você faça a migração tão logo perceba a necessidade.

                </p>

                <p>
                    Note que você precisa prestar especial atenção à
                    natureza das suas <em>atividade complementares
                    flexíveis</em>. Esta é a principal diferença entre o
                    currículo antigo e o novo. No antigo, você precisa
                    integralizar ${CREDITOS_COMPLEMENTARES} créditos em 
                    <b>atividades complementares flexíveis</b>. Já no
                    currículo novo, são ${NOVO_CREDITOS_COMPLEMENTARES}
                    créditos em 
                    <b>atividades complementares flexíveis</b> e 
                    ${NOVO_CREDITOS_DE_EXTENSAO} em
                    <b>atividades acadêmicas de extensão</b>. Todas as
                    atividades acadêmicas de extensão podem também ser
                    consideradas
                    atividades complementares flexíveis. Mas o contrário
                    não é verdade. O mais sensato é
                    priorizar, a partir de agora, atividades acadêmicas
                    de extensão, já que têm validade em ambos os
                    currículos.
                </p>`;

            break;

        case 'tem que migrar':
            debug = `tem que migrar<br>` + 
                    `(creditos_a_cursar > MAX_POSSIVEL)`;
            $message.innerHTML = `
                <h2>Orientação</h2>
                <pre>${debug}</pre>
                <p>
                    Você <b>DEVE MIGRAR</b> para o novo currículo.
                    Você só acumulou ${completed} créditos
                    até o momento. Logo, ainda precisa acumular, no mínimo,
                    mais ${creditos_a_cursar} créditos para concluir o curso.
                    Como o máximo de créditos que se pode matricular 
                    por período letivo é de ${MAX_MATRICULA}, é
                    matematicamente impossível que você conclua o que ainda
                    falta do curso em ${PERIODOS_RESTANTES} períodos
                    letivos
                    (lembre que 2025.2 é o último período letivo
                    para concluir com a grade antiga).
                </p>`;
            break;

        case 'situação indefinida':
        default:
            debug = `situação indefinida<br>` + 
                    `(condição não prevista: caso default do switch)`;

            $message.innerHTML = `${debug}Ops... procure a coordenação, por favor.`;
            break;
    }
}

window.addEventListener("keyup", update);
