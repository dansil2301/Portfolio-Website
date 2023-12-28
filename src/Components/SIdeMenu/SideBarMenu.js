import {useState} from "react";

export function SideBarMenu({ isVisible, setSidebarVisible }) {
    const [isHovered, setHovered] = useState(false);
    const sidebarClasses = `SideBarMenu ${isVisible ? 'visible' : ''}`;
    const hideRestPageClasses = `HideRestPage ${isVisible ? 'HidePage' : ''}`

    return (
        <>
            <div className={sidebarClasses} id="SideBarIndex">
                <div className="closeBtn" id="closeBtnId">
                    <svg width="30" height="30" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg"
                         onMouseOver={() => setHovered(true)}
                         onMouseOut={() => setHovered(false)}
                         onClick={() => setSidebarVisible(false)}>
                        <line style={{ transition: "stroke 0.3s ease-in-out" }} y1="-1.5" x2="49.4975" y2="-1.5" transform="matrix(0.707107 -0.707107 0.717263 0.696803 3.64087 38.139)" stroke={isHovered ? "#666666" : "#969696"} stroke-width="3"/>
                        <line style={{ transition: "stroke 0.3s ease-in-out" }} y1="-1.5" x2="49.4975" y2="-1.5" transform="matrix(-0.707107 -0.707107 0.696803 -0.717263 37.6409 35.3002)" stroke={isHovered ? "#666666" : "#969696"} stroke-width="3"/>
                    </svg>
                </div>
                <div className="WebsiteSections">
                    <button className="WebsiteSectionsEl">{"Home"}</button>
                    <button className="WebsiteSectionsEl">{"About Me"}</button>
                    <button className="WebsiteSectionsEl">{"Projects"}</button>
                </div>
                <div className="SideBarWhiteLine"></div>
                <div className="subSections">
                    <button className="WebsiteSectionsEl SubsectionsEl">{"Resume"}</button>
                </div>
            </div>
            <div className={hideRestPageClasses} />
        </>
    )
}