const TOTAL_CREDITOS = 208;
const PERIODOS_RESTANTES = 5;
const MAX_CREDITOS_SEMESTRE = 24;
const CONST1 = 72;
const CONST2 = 96;
const CONST3 = 196;
const CONST4 = 170;
const MAX_POSSIVEL = PERIODOS_RESTANTES * MAX_CREDITOS_SEMESTRE;

let $completed = document.querySelector("#completed");
let $projected = document.querySelector("#projected");
let $message = document.querySelector("#message");
let $periodos = document.querySelector("#periodos");
let $pace = document.querySelector("#pace");
let $acursar = document.querySelector("#acursar");
let $max_acursar = document.querySelector("#max-acursar");

function update() {
    console.log("atualizando...");
    let completed = Number($completed.value);
    let num_periodos_cursados = Number($periodos.value);
    let pace = completed / num_periodos_cursados;

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
    let projected = pace * PERIODOS_RESTANTES + completed;
    if (Number.isFinite(projected)) {
        $projected.value = Math.trunc(projected);
    } else {
        $projected.value = "";
    }

    // atualiza creditos_a_cursar
    let creditos_a_cursar = TOTAL_CREDITOS - completed;
    $acursar.value = creditos_a_cursar;

    if (creditos_a_cursar > MAX_POSSIVEL) {
        $message.innerHTML = `
            <pre>tem que migrar <br>(creditos_a_cursar > ${MAX_POSSIVEL})</pre>
            <p>
                Sim, você <b>DEVE MIGRAR</b> para o novo currículo.
                Como você só acumulou ${completed} créditos
                até o momento, ainda precisa acumular, no mínimo,
                mais ${creditos_a_cursar} créditos para concluir o curso.
                Como o máximo de créditos que se pode matricular 
                por semestre é de ${MAX_CREDITOS_SEMESTRE}, é
                matematicamente impossível você concluir o que ainda
                falta do curso em ${PERIODOS_RESTANTES} semestres
                (lembre que 2025.2 é o último semestre
                para concluir com a grade antiga).
            </p>`;

    } else if ((completed > CONST1 && completed <= CONST2 && projected < CONST3) || projected < CONST4) {
        let debug = 
            `<pre>vai migrar<br>` + 
            `((completed > ${CONST1} && completed <= ${CONST2} && projected < ${CONST3}) || projected < ${CONST4})</pre>`;
        $message.innerHTML = `
            ${debug}
            <p>
                Template de mensagem ainda a ser escrita.
            </p>`;
    } else if (completed <= CONST2 && projected >= CONST3)  {
        let debug = 
            `<pre>é possível que vá migrar (mas não deve migrar já)<br>` + 
            `(completed <= ${CONST2} && projected >= ${CONST3})</pre>`;
        $message.innerHTML = `
            ${debug}
            <p>
                Template de mensagem ainda a ser escrita.
            </p>`;
    } else if (completed > CONST2 && (projected > CONST4 && projected < CONST3)) {
        let debug = 
            `<pre>provavelmente não vai migrar<br>` +
            `completed = ${completed}<br>` + 
            `projected = ${projected}<br>` +
            `(projected > ${CONST2} && (projected > ${CONST4} && projected < ${CONST3}))</pre>`;
        $message.innerHTML = 
            `${debug}
            <p>
                Template de mensagem ainda a ser escrita.
            </p>`;
    } else if (periodos >= 9 || (completed > CONST2 &&  projected >= CONST3)) {
        let debug = 
            `<pre>não vai migrar<br>` + 
            `(periodos >= 9 || (completed > ${CONST2} && projected >= ${CONST3}))</pre>`;
        $message.innerHTML = 
            `${debug}
            <p>
                Não há motivos pra você migrar. Mas você precisa concluir em menos de 5 semestres. E tome cuidado com 
                a matrícula! Não matricule disciplinas que você já pagou no currículo passado, mesmo que você possa
                se matricular nelas.
            </p>`;
    } else {
        $message.innerHTML = `Ops... não sei dizer... procure a coordenação, por favor.`;
    }
}

window.addEventListener("keyup", update);
