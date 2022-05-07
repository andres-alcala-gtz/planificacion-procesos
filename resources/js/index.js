document.getElementById("input-button").addEventListener("click", (() => {


    let inputProcess = document.getElementById("input-process").value;
    if (0 >= inputProcess)
    {
        alert("Condición no cumplida en Procesos (0 < x)");
        return;
    }

    let inputSlot = document.getElementById("input-slot").value * 100;
    if (3 * 100 > inputSlot || 6 * 100 < inputSlot)
    {
        alert("Condición no cumplida en Rodaja (3 < x < 6)");
        return;
    }

    const TIMER_GLOBAL = new Timer(10);

    let arrayCreated = new Array();
    let arrayBlocked = new Array();
    let arrayWaiting = new Array();
    let arrayRunning = new Array();
    let arrayTerminated = new Array();

    exec();


    async function exec()
    {
        document.getElementById("input-process").disabled = true;
        document.getElementById("input-slot").disabled = true;
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

                manageBlocked();
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
            moveUndefinedCreated();
        }

        let arrayCreatedLength = arrayCreated.length;
        for (let i = 0; i < Math.min(CAPACITY.MEMORY, arrayCreatedLength); ++i)
        {
            moveCreatedWaiting();
        }
    }


    function manageBlocked()
    {
        if ((!arrayBlocked.length))
        {
            return;
        }

        for (let i = 0; i < arrayBlocked.length; ++i)
        {
            arrayBlocked.at(i).timeBlocked += TIMER_GLOBAL.currentCycle - arrayBlocked.at(i).timeLast;
            arrayBlocked.at(i).timeLast = TIMER_GLOBAL.currentCycle;

            if (arrayBlocked.at(i).timeBlockedRemaining <= 0)
            {
                moveBlockedWaiting();
            }

            drawBlocked();
        }
    }


    function manageWaiting()
    {
        if ((!arrayCreated.length) || (arrayBlocked.length + arrayWaiting.length + arrayRunning.length >= CAPACITY.MEMORY))
        {
            return;
        }

        moveCreatedWaiting();
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
            arrayRunning.at(-1).timeSlot += TIMER_GLOBAL.currentCycle - arrayRunning.at(-1).timeLast;
            arrayRunning.at(-1).timeExecuted += TIMER_GLOBAL.currentCycle - arrayRunning.at(-1).timeLast;
            arrayRunning.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

            if (arrayRunning.at(-1).timeSlot >= inputSlot)
            {
                moveRunningWaiting();
            }

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
        if ((arrayCreated.length || arrayBlocked.length || arrayWaiting.length || arrayRunning.length))
        {
            return;
        }

        TIMER_GLOBAL.repeat(false);
        drawProcess();
    }


    function moveUndefinedCreated()
    {
        arrayCreated.push(new ProcessRandom());

        arrayCreated.at(-1).stateProcess = STATE.CREATED;
        arrayCreated.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

        drawHeader();
    }


    function moveCreatedWaiting()
    {
        if (!arrayCreated.length)
        {
            return;
        }

        arrayWaiting.push(arrayCreated.shift());

        arrayWaiting.at(-1).stateProcess = STATE.WAITING;
        arrayWaiting.at(-1).timeArrived = TIMER_GLOBAL.currentCycle;
        arrayWaiting.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

        drawHeader();
        drawWaiting();
    }


    function moveBlockedWaiting()
    {
        if (!arrayBlocked.length)
        {
            return;
        }

        arrayWaiting.push(arrayBlocked.shift());

        arrayWaiting.at(-1).stateProcess = STATE.WAITING;
        arrayWaiting.at(-1).timeBlocked = CODE.NULL;
        arrayWaiting.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

        drawBlocked();
        drawWaiting();
    }


    function moveWaitingRunning()
    {
        if (!arrayWaiting.length)
        {
            return;
        }

        arrayRunning.push(arrayWaiting.shift());

        arrayRunning.at(-1).stateProcess = STATE.RUNNING;
        arrayRunning.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

        if (!arrayRunning.at(-1).flagExecuted)
        {
            arrayRunning.at(-1).timeReplied = TIMER_GLOBAL.currentCycle - arrayRunning.at(-1).timeArrived;
            arrayRunning.at(-1).flagExecuted = true;
        }

        drawWaiting();
        drawRunning();
    }


    function moveRunningBlocked()
    {
        if (!arrayRunning.length)
        {
            return;
        }

        arrayBlocked.push(arrayRunning.shift());

        arrayBlocked.at(-1).stateProcess = STATE.BLOCKED;
        arrayBlocked.at(-1).timeSlot = 0;
        arrayBlocked.at(-1).timeBlocked = 0;
        arrayBlocked.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

        drawRunning();
        drawBlocked();
    }


    function moveRunningWaiting()
    {
        if (!arrayRunning.length)
        {
            return;
        }

        arrayWaiting.push(arrayRunning.shift());

        arrayWaiting.at(-1).stateProcess = STATE.WAITING;
        arrayWaiting.at(-1).timeSlot = 0;
        arrayWaiting.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

        drawRunning();
        drawWaiting();
    }


    function moveRunningTerminated(successful)
    {
        if (!arrayRunning.length)
        {
            return;
        }

        arrayTerminated.push(arrayRunning.shift());

        arrayTerminated.at(-1).stateProcess = STATE.TERMINATED;
        arrayTerminated.at(-1).terminate(successful);
        arrayTerminated.at(-1).timeSlot = 0;
        arrayTerminated.at(-1).timeDeparted = TIMER_GLOBAL.currentCycle;
        arrayTerminated.at(-1).timeLast = TIMER_GLOBAL.currentCycle;

        drawRunning();
        drawTerminated();
    }


    function drawHeader()
    {
        document.getElementById("timer-global").textContent = timeFormat(TIMER_GLOBAL.currentCycle);
        document.getElementById("timer-slot").textContent = timeFormat(inputSlot);
        document.getElementById("counter-created").textContent = arrayCreated.length;
    }


    function drawBlocked()
    {
        let tableBlocked = document.getElementById("table-blocked");
        tableBlocked.replaceChildren();

        for (const process of arrayBlocked)
        {
            let rowBlocked = document.createElement("tr");
            let identifierProcess = document.createElement("td");
            let timeCondemned = document.createElement("td");
            let timeBlocked = document.createElement("td");

            identifierProcess.textContent = process.identifierProcess;
            timeCondemned.textContent = timeFormat(TIME.MAX_BLOCKED);
            timeBlocked.textContent = timeFormat(process.timeBlocked);

            rowBlocked.append(identifierProcess, timeCondemned, timeBlocked);
            tableBlocked.append(rowBlocked);
        }
    }


    function drawWaiting()
    {
        let tableWaiting = document.getElementById("table-waiting");
        tableWaiting.replaceChildren();

        for (const process of arrayWaiting)
        {
            let rowWaiting = document.createElement("tr");
            let identifierProcess = document.createElement("td");
            let timeEstimated = document.createElement("td");
            let timeExecuted = document.createElement("td");

            identifierProcess.textContent = process.identifierProcess;
            timeEstimated.textContent = timeFormat(process.timeEstimated);
            timeExecuted.textContent = timeFormat(process.timeExecuted);

            rowWaiting.append(identifierProcess, timeEstimated, timeExecuted);
            tableWaiting.append(rowWaiting);
        }
    }


    function drawRunning()
    {
        document.getElementById("table-running-identifier-process").textContent = CODE.NULL;
        document.getElementById("table-running-operation-complete").textContent = CODE.NULL;
        document.getElementById("table-running-time-estimated").textContent = CODE.NULL;
        document.getElementById("table-running-time-slot").textContent = CODE.NULL;
        document.getElementById("table-running-time-executed").textContent = CODE.NULL;
        document.getElementById("table-running-time-executed-remaining").textContent = CODE.NULL;

        for (const process of arrayRunning)
        {
            document.getElementById("table-running-identifier-process").textContent = process.identifierProcess;
            document.getElementById("table-running-operation-complete").textContent = process.operationComplete;
            document.getElementById("table-running-time-estimated").textContent = timeFormat(process.timeEstimated);
            document.getElementById("table-running-time-slot").textContent = timeFormat(process.timeSlot);
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
            let identifierProcess = document.createElement("td");
            let operationComplete = document.createElement("td");
            let operationResult = document.createElement("td");

            identifierProcess.textContent = process.identifierProcess;
            operationComplete.textContent = process.operationComplete;
            operationResult.textContent = process.operationResult;

            rowTerminated.append(identifierProcess, operationComplete, operationResult);
            tableTerminated.append(rowTerminated);
        }
    }


    function drawProcess()
    {
        let arrayProcess = [].concat(arrayCreated, arrayBlocked, arrayWaiting, arrayRunning, arrayTerminated);

        let modalProcess = new bootstrap.Modal(document.getElementById("modal-process"));

        let tableProcess = document.getElementById("table-process");
        tableProcess.replaceChildren();

        document.getElementById("timer-process").textContent = timeFormat(TIMER_GLOBAL.currentCycle);

        for (const process of arrayProcess)
        {
            let rowProcess = document.createElement("tr");
            let identifierProcess = document.createElement("td");
            let stateProcess = document.createElement("td");
            let operationComplete = document.createElement("td");
            let operationResult = document.createElement("td");
            let timeEstimated = document.createElement("td");
            let timeExecuted = document.createElement("td");
            let timeExecutedRemaining = document.createElement("td");
            let timeBlocked = document.createElement("td");
            let timeBlockedRemaining = document.createElement("td");
            let timeArrived = document.createElement("td");
            let timeDeparted = document.createElement("td");
            let timeReplied = document.createElement("td");
            let timeReturned = document.createElement("td");
            let timeHalted = document.createElement("td");

            identifierProcess.textContent = process.identifierProcess;
            stateProcess.textContent = process.stateProcess;
            operationComplete.textContent = process.operationComplete;
            operationResult.textContent = process.operationResult;
            timeEstimated.textContent = timeFormat(process.timeEstimated);
            timeExecuted.textContent = timeFormat(process.timeExecuted);
            timeExecutedRemaining.textContent = timeFormat(process.timeExecutedRemaining);
            timeBlocked.textContent = timeFormat(process.timeBlocked);
            timeBlockedRemaining.textContent = timeFormat(process.timeBlockedRemaining);
            timeArrived.textContent = timeFormat(process.timeArrived);
            timeDeparted.textContent = timeFormat(process.timeDeparted);
            timeReplied.textContent = timeFormat(process.timeReplied);
            timeReturned.textContent = timeFormat(process.timeReturned);
            timeHalted.textContent = timeFormat(process.timeHalted);

            rowProcess.append(identifierProcess, stateProcess, operationComplete, operationResult, timeEstimated, timeExecuted, timeExecutedRemaining, timeBlocked, timeBlockedRemaining, timeArrived, timeDeparted, timeReplied, timeReturned, timeHalted);
            tableProcess.append(rowProcess);
        }

        modalProcess.show();
    }


    function keyListener(event)
    {
        console.log(event.key);

        switch (event.key)
        {
            case KEY.CREATE:
                moveUndefinedCreated();
                break;

            case KEY.INTERRUPT:
                moveRunningBlocked();
                break;

            case KEY.TERMINATE:
                moveRunningTerminated(false);
                break;

            case KEY.PROCESS:
                TIMER_GLOBAL.pause();
                drawProcess();
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