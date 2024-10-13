import React, {useState, useRef, useEffect} from "react";
import { useSocket } from "../SocketProvider";
import SInput from "../modules/SInput";

const Form = ({isOpen, isOver, gameId})=>{
    const {connection} = useSocket();
    const [userInput, setUserInput] = useState('');
    const textInput = useRef(null);

    useEffect(()=>{
        if(!isOpen){
            textInput.current.focus();
        }
    }, [isOpen])

    const resetForm =() => {
        setUserInput("");
    }

    const onChange = async e =>{
        let value = e.target.value;
        let lastChar = value.charAt(value.length - 1);
        if(lastChar === " "){
            if (connection) {
                try {
                    console.log(userInput, gameId)
                    await connection.invoke('UserInput', userInput, gameId);
            resetForm();
                    console.log('Game creation initiated');
                } catch (error) {
                    console.error('Error creating game:', error);
                }
            } else {
                console.error('No SignalR connection available');
            }
        }
        else{
            setUserInput(e.target.value)
        }
    }

    return (
        <SInput
            type="text"
            readOnly={isOpen || isOver}
            onChange={onChange}
            value={userInput}
            className="form-control"
            ref={textInput} 
        />
    )
}

export default Form