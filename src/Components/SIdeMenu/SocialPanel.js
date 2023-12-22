import github from '../../Imgs/SocialIcons/github-icons.png'
import linkedin from '../../Imgs/SocialIcons/linkedin-icon.png'
import instagram from '../../Imgs/SocialIcons/instagram-icons.png'

export function SocialPanel() {
    const handleMouseOver = () => {
        document.getElementById("white-line-index").style.marginBottom = "16px";
    };

    const handleMouseLeave = () => {
        document.getElementById("white-line-index").style.marginBottom = "10px";
    }

    return (
        <div className="SocialPanel">
            <p className="SocialText">SOCIAL</p>
            <div className="white-line" id="white-line-index"></div>
            <img className="SocialIcons" src={github} alt="GitHub icon" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}/>
            <img className="SocialIcons" src={linkedin} alt="LinkedIn icon" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}/>
            <img className="SocialIcons" src={instagram} alt="Instagram icon" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}/>
        </div>
    )
}