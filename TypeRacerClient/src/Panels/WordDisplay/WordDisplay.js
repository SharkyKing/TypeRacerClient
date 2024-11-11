import React from "react";

const invisibleTextStyle = {
    color: "transparent",
    textShadow: "0 0 0 rgba(0, 0, 0, 0)"
};

const typedCorrectStyle={
    "backgroundColor": "#34eb77",
    "paddingLeft": "1rem",
    "paddingRight": "1rem",
    "marginLeft": "1rem",
    "marginRight": "1rem",
    "borderRadius":"1rem"
}

const currentStyle = {
    "textDecoration": "overline",
    "marginRight": "1rem",
    "color":"black"
}

const leftStyle = {
    "color":"black"
}

const getTypedWords = (words, player) => {
    const wordArray = words.split(" ");
    let typedWords = wordArray.slice(0, player.currentWordIndex).join(" ");
    const style = player.wordVisible ? typedCorrectStyle : { ...typedCorrectStyle, ...invisibleTextStyle };
    return <span style={style}>{typedWords}</span>;
};

const getCurrentWord = (words, player) => {
    const wordArray = words.split(" ");
    const style = player.wordVisible ? currentStyle : { ...currentStyle, ...invisibleTextStyle };
    return <span style={style}>{wordArray[player.currentWordIndex]}</span>;
};

const getLeftWords = (words, player) => {
    const wordArray = words.split(" ");
    let wordsLeft = wordArray.slice(player.currentWordIndex + 1, wordArray.length).join(" ");
    const style = player.wordVisible ? leftStyle : { ...leftStyle, ...invisibleTextStyle };
    return <span style={style}> {wordsLeft}</span>;
};

const WordDisplay = ({gameState, player}) => {
    if (!player || typeof player.currentWordIndex !== 'number') {
        return <div style={{ color: 'black' }}>{gameState.words}</div>
    }

    return (
        <>
            {getTypedWords(gameState.words, player)}
            {getCurrentWord(gameState.words, player)}
            {getLeftWords(gameState.words, player)}
        </>
    )
}

export default WordDisplay;