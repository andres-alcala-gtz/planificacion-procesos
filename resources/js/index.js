document.getElementById("input-button").addEventListener("click", (() => {


    let inputProcess = document.getElementById("input-process").value;
    if (0 >= inputProcess)
    {
        alert("Condición no cumplida en Procesos (0 < x)");
        return;
    }

    const TIMER_GLOBAL = new Timer(10);

    let arrayCreated = new Array();
    let arrayWaiting = new Array();
    let arrayRunning = new Array();
    let arrayTerminated = new Array();

    exec();


    async function exec()
    {
        document.getElementById("input-process").disabled = true;
        document.getElementById("input-button").disabled = true;

        manageCreated();

        document.addEventListener("keydown", keyListener);
        await run();
        document.removeEventListener("keydown", keyListener);

        TIMER_GLOBAL.destroy();
    }


    async function run()
    {
        return new Promise((resolve) => {
            TIMER_GLOBAL.action(() => {

                drawHeader();

                manageWaiting();
                manageRunning();
                manageTerminated();

                manageEnding();

            }).done(resolve).start()
        })
    }


    function manageCreated()
    {
        if ((inputProcess < 1))
        {
            return;
        }

        for (let i = 0; i < inputProcess; ++i)
        {
            arrayCreated.push(new ProcessRandom());
        }
    }


    function manageWaiting()
    {
        if ((!arrayCreated.length || arrayWaiting.length || arrayRunning.length))
        {
            return;
        }

        let arrayCreatedLength = arrayCreated.length;
        for (let i = 0; i < Math.min(CAPACITY.BATCH, arrayCreatedLength); ++i)
        {
            moveCreatedWaiting();
        }
    }


    function manageRunning()
    {
        if ((!arrayWaiting.length && !arrayRunning.length))
        {
            return;
        }

        if (!arrayRunning.length)
        {
            moveWaitingRunning();
        }
        if (arrayRunning.length)
        {
            arrayRunning.at(-1).timeExecuted += TIMER_GLOBAL.currentCycle - arrayRunning.at(-1).timeLast;
            arrayRunning.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

            drawRunning();
        }
    }


    function manageTerminated()
    {
        if ((!arrayRunning.length) || (arrayRunning.at(-1).timeExecutedRemaining > 0))
        {
            return;
        }

        moveRunningTerminated(true);
    }


    function manageEnding()
    {
        if ((arrayCreated.length || arrayWaiting.length || arrayRunning.length))
        {
            return;
        }

        TIMER_GLOBAL.repeat(false);
    }


    function moveCreatedWaiting()
    {
        arrayWaiting.push(arrayCreated.shift());

        drawWaiting();
    }


    function moveWaitingRunning()
    {
        arrayRunning.push(arrayWaiting.shift());

        arrayRunning.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

        drawWaiting();
        drawRunning();
    }


    function moveRunningWaiting()
    {
        arrayWaiting.push(arrayRunning.shift());

        arrayWaiting.at(-1).timeLast = CODE.NULL;

        drawRunning();
        drawWaiting();
    }


    function moveRunningTerminated(successful)
    {
        arrayTerminated.push(arrayRunning.shift());

        arrayTerminated.at(-1).terminate(successful);

        drawRunning();
        drawTerminated();
    }


    function drawHeader()
    {
        document.getElementById("timer-global").textContent = timeFormat(TIMER_GLOBAL.currentCycle);
        document.getElementById("counter-batch").textContent = identifierBatch(arrayCreated.length);
    }


    function drawWaiting()
    {
        let tableWaiting = document.getElementById("table-waiting");
        tableWaiting.replaceChildren();

        for (const process of arrayWaiting)
        {
            let rowWaiting = document.createElement("tr");
            let identifierBatch = document.createElement("td");
            let identifierProcess = document.createElement("td");
            let timeEstimated = document.createElement("td");
            let timeExecuted = document.createElement("td");

            identifierBatch.textContent = process.identifierBatch;
            identifierProcess.textContent = process.identifierProcess;
            timeEstimated.textContent = timeFormat(process.timeEstimated);
            timeExecuted.textContent = timeFormat(process.timeExecuted);

            rowWaiting.append(identifierBatch, identifierProcess, timeEstimated, timeExecuted);
            tableWaiting.append(rowWaiting);
        }
    }


    function drawRunning()
    {
        document.getElementById("table-running-identifier-batch").textContent = CODE.NULL;
        document.getElementById("table-running-identifier-process").textContent = CODE.NULL;
        document.getElementById("table-running-operation-complete").textContent = CODE.NULL;
        document.getElementById("table-running-time-estimated").textContent = CODE.NULL;
        document.getElementById("table-running-time-executed").textContent = CODE.NULL;
        document.getElementById("table-running-time-executed-remaining").textContent = CODE.NULL;

        for (const process of arrayRunning)
        {
            document.getElementById("table-running-identifier-batch").textContent = process.identifierBatch;
            document.getElementById("table-running-identifier-process").textContent = process.identifierProcess;
            document.getElementById("table-running-operation-complete").textContent = process.operationComplete;
            document.getElementById("table-running-time-estimated").textContent = timeFormat(process.timeEstimated);
            document.getElementById("table-running-time-executed").textContent = timeFormat(process.timeExecuted);
            document.getElementById("table-running-time-executed-remaining").textContent = timeFormat(process.timeExecutedRemaining);
        }
    }


    function drawTerminated()
    {
        let tableTerminated = document.getElementById("table-terminated");
        tableTerminated.replaceChildren();

        for (const process of arrayTerminated)
        {
            let rowTerminated = document.createElement("tr");
            let identifierBatch = document.createElement("td");
            let identifierProcess = document.createElement("td");
            let operationComplete = document.createElement("td");
            let operationResult = document.createElement("td");

            identifierBatch.textContent = process.identifierBatch;
            identifierProcess.textContent = process.identifierProcess;
            operationComplete.textContent = process.operationComplete;
            operationResult.textContent = process.operationResult;

            rowTerminated.append(identifierBatch, identifierProcess, operationComplete, operationResult);
            tableTerminated.append(rowTerminated);
        }
    }


    function keyListener(event)
    {
        console.log(event.key);

        switch (event.key)
        {
            case KEY.INTERRUPT:
                moveRunningWaiting();
                break;

            case KEY.TERMINATE:
                moveRunningTerminated(false);
                break;

            case KEY.PAUSE:
                TIMER_GLOBAL.pause();
                break;

            case KEY.RESUME:
                TIMER_GLOBAL.resume();
                break;

            default:
                break;
        }
    }


}))