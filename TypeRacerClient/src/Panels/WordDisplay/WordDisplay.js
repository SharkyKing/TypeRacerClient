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

const parseStyleString = (styleString) => {
    if (!styleString) return {};
    console.log("tipas", typeof styleString);
    console.log("value", styleString);
    const styleObj = {};
    const styles = styleString.split(';');

    styles.forEach(style => {
        const [property, value] = style.split(":").map(s => s.trim());
        if (property && value) {
            styleObj[property] = value;
        }
    });

    return styleObj;
};

const getTypedWords = (words, player, extraStyle) => {
    const wordArray = words.split(" ");
    let typedWords = wordArray.slice(0, player.currentWordIndex).join(" ");
    
    const parsedExtraStyle = (typeof extraStyle === 'string' && extraStyle) 
    ? parseStyleString(extraStyle) 
    : {}; 


    const style = {
        ...player.wordVisible ? typedCorrectStyle : { ...typedCorrectStyle, ...invisibleTextStyle },
        ...parsedExtraStyle, 
    };

    return <span style={style}>{typedWords}</span>;
};

const getCurrentWord = (words, player, extraStyle) => {
    const wordArray = words.split(" ");
    
    const parsedExtraStyle = (typeof extraStyle === 'string' && extraStyle) 
        ? parseStyleString(extraStyle) 
        : {}; 


    const style = {
        ...player.wordVisible ? currentStyle : { ...currentStyle, ...invisibleTextStyle },
        ...parsedExtraStyle,
    };

    return <span style={style}>{wordArray[player.currentWordIndex]}</span>;
};

const getLeftWords = (words, player, extraStyle) => {
    const wordArray = words.split(" ");
    let wordsLeft = wordArray.slice(player.currentWordIndex + 1, wordArray.length).join(" ");
    
    const parsedExtraStyle = (typeof extraStyle === 'string' && extraStyle) 
        ? parseStyleString(extraStyle) 
        : {}; 

    const style = {
        ...player.wordVisible ? leftStyle : { ...leftStyle, ...invisibleTextStyle },
        ...parsedExtraStyle,
    };

    return <span style={style}>{wordsLeft}</span>;
};

const WordDisplay = ({ words, player, WordStyles }) => {
    if (!player || typeof player.currentWordIndex !== 'number') {
        return <div style={{ color: 'black' }}>{gameState.words}</div>
    }

    const selectedStyle = WordStyles|| ''; 
    const styleString = selectedStyle ? selectedStyle : '';
    return (
        <>
            {getTypedWords(words, player, styleString)}
            {getCurrentWord(words, player, styleString)}
            {getLeftWords(words, player, styleString)}
        </>
    );
};


export default WordDisplay;