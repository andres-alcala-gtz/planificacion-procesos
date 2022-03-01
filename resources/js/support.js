function numberRandom(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timeFill(segment)
{
    return String(segment).padStart(2, "0");
}

function timeFormat(centisecond)
{
    if (centisecond === CODE.NULL)
    {
        return CODE.NULL;
    }

    let m  = Math.floor((centisecond / 6000) / (  1));
    let s  = Math.floor((centisecond % 6000) / (100));
    let cs = Math.floor((centisecond % 6000) % (100));
    return `${timeFill(m)}:${timeFill(s)}.${timeFill(cs)}`;
}