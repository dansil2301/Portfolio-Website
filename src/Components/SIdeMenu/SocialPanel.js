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

    const openLinkInNewWindow = (name) => {
        const linkUrl ={
            "linkedIn": "https://www.linkedin.com/in/danila-solovienko-08414727b/",
            "gitHub": "https://github.com/dansil2301",
            "instagram": "https://www.instagram.com/danila_sololo/",
        };
        console.log(linkUrl[name]);
        window.open(linkUrl[name], '_blank');
    };

    return (
        <div className="SocialPanel">
            <p className="SocialText">SOCIAL</p>
            <div className="white-line" id="white-line-index"></div>
            <button className="socialBtn" onClick={() => openLinkInNewWindow("linkedIn")}>
                <img className="SocialIcons" src={linkedin} alt="LinkedIn icon" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}/>
            </button>
            <button className="socialBtn" onClick={() => openLinkInNewWindow("gitHub")}>
                <img className="SocialIcons" src={github} alt="GitHub icon" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}/>
            </button>
            <button className="socialBtn" onClick={() => openLinkInNewWindow("instagram")}>
                <img className="SocialIcons" src={instagram} alt="Instagram icon" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}/>
            </button>
        </div>
    )
}