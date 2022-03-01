const CAPACITY = {
    MEMORY: 5
}

const TIME = {
    MAX_BLOCKED  :  8 * 100,
    MIN_ESTIMATED:  6 * 100,
    MAX_ESTIMATED: 16 * 100
}

const PROCESS = {
    MIN_OPERAND: - 99,
    MAX_OPERAND: + 99
}

const OPERATOR = {
    ADDITION      : "+",
    SUBTRACTION   : "-",
    MULTIPLICATION: "*",
    DIVISION      : "/",
    MODULUS       : "%"
}

const STATE = {
    CREATED   : "CREATED",
    BLOCKED   : "BLOCKED",
    WAITING   : "WAITING",
    RUNNING   : "RUNNING",
    TERMINATED: "TERMINATED"
}

const KEY = {
    CREATE   : "n",
    INTERRUPT: "i",
    TERMINATE: "e",
    PROCESS  : "t",
    PAUSE    : "p",
    RESUME   : "c"
}

const CODE = {
    ERROR: "ERROR",
    NULL : "-"
}