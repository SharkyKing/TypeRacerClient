import React from "react";

const typedCorrectStyle={
    "backgroundColor": "#34eb77",
    "paddingLeft": "1rem",
    "paddingRight": "1rem",
    "borderRadius":"1rem"
}

const currentStyle = {
    "textDecoration": "underline",
    "color":"black"
}

const leftStyle = {
    "textDecoration": "underline",
    "color":"black"
}

const getTypedWords = (words, player) => {
    const wordArray = words.split(" ");
    let typedWords = wordArray.slice(0, player.currentWordIndex).join(" ");
    return <span style={typedCorrectStyle}>{typedWords} </span>
}

const getCurrentWord = (words, player) => {
    const wordArray = words.split(" ");
    return <span style={currentStyle}>{wordArray[player.currentWordIndex]}</span>
}

const getLeftWords = (words, player) => {
    const wordArray = words.split(" ");
    let wordsLeft = wordArray.slice(player.currentWordIndex + 1, wordArray.length).join(" ");
    return <span style={leftStyle}> {wordsLeft}</span>
}

const DisplayWords = ({words, player}) => {
    if (!player || typeof player.currentWordIndex !== 'number') {
        return <div style={{ color: 'black' }}>{words} ASD</div>
    }

    return (
        <>
            {getTypedWords(words, player)}
            {getCurrentWord(words, player)}
            {getLeftWords(words, player)}
        </>
    )
}

export default DisplayWords;