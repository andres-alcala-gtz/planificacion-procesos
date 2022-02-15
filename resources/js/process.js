class ProcessRegular
{
    static identifierCurrent = 0;

    constructor(operationLeft, operationRight, operationSymbol, timeEstimated)
    {
        this.identifierProcess = ++ProcessRegular.identifierCurrent;
        this.identifierBatch = identifierBatch(this.identifierProcess);

        this.operationLeft = operationLeft;
        this.operationRight = operationRight;
        this.operationSymbol = operationSymbol;
        this.operationResult = CODE.NULL;

        this.timeEstimated = timeEstimated;
        this.timeExecuted = 0;
        this.timeLast = CODE.NULL;
    }

    get timeExecutedRemaining()
    {
        return this.timeEstimated - this.timeExecuted;
    }

    get operationComplete()
    {
        return `${this.operationLeft} ${this.operationSymbol} ${this.operationRight}`;
    }

    terminate(successful)
    {
        this.operationResult = successful ? eval(this.operationComplete).toFixed(2) : CODE.ERROR;
    }
}


class ProcessRandom extends ProcessRegular
{
    constructor()
    {
        const operatorComplete = Object.values(OPERATOR);
        const operatorDanger = operatorComplete.slice(-2);

        let operationLeft = numberRandom(PROCESS.MIN_OPERAND, PROCESS.MAX_OPERAND);
        let operationRight = numberRandom(PROCESS.MIN_OPERAND, PROCESS.MAX_OPERAND);
        let operationSymbol = operatorComplete.at(numberRandom(0, operatorComplete.length - 1));
        let timeEstimated = numberRandom(TIME.MIN_ESTIMATED, TIME.MAX_ESTIMATED);

        while (operatorDanger.includes(operationSymbol) && !operationRight)
        {
            operationRight = numberRandom(PROCESS.MIN_OPERAND, PROCESS.MAX_OPERAND);
        }

        super(operationLeft, operationRight, operationSymbol, timeEstimated);
    }
}