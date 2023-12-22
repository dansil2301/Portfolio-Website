import {useEffect, useState} from "react";
import {EyeElement} from "./EyeElement";

export function AboutMeTextIndex() {
    const [text, setText] = useState('');
    const content = ['Hi, my name is Danila.', 'I bring your ideas to reality.'];
    const [isWritten, setWritten] = useState(false);
    let printedText = '';

    useEffect(() => {
        let index = 0;
        let timer;

        const typeText = () => {
            printedText += content[index].charAt(0);
            setText(printedText);
            content[index] = content[index].substring(1);

            if (content[index].length === 0) {
                index++;
                if (index < content.length) {
                    timer = setTimeout(typeText, 500); // Pause between phrases
                    printedText += "\n";
                    setText(printedText);
                }
                else{
                    setWritten(true);
                }
            } else {
                timer = setTimeout(typeText, 100); // Typing speed
            }
        };

        typeText();

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="IndexCenterElements">
            <text className="AboutMeTextIndex" style={{ whiteSpace: "pre-line" }}>
                {text}
            </text>
            <EyeElement
                show={isWritten}/>
        </div>
    )
}

