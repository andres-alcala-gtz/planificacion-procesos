const CAPACITY = {
    BATCH: 5
}

const TIME = {
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
    WAITING   : "WAITING",
    RUNNING   : "RUNNING",
    TERMINATED: "TERMINATED"
}

const KEY = {
    INTERRUPT: "i",
    TERMINATE: "e",
    PAUSE    : "p",
    RESUME   : "c"
}

const CODE = {
    ERROR: "ERROR",
    NULL : "-"
}