// function to randomize the order that array elements are in
export function randomizeArray(array)
{
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0)
    {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}

export function decodeHtml(html)
{
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
}