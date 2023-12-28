import './App.css';
import {BackgroundParticles} from "./Components/BackgroundParticles";
import {SideBarMenu} from "./Components/SIdeMenu/SideBarMenu";
import {MenuBtn} from "./Components/SIdeMenu/MenuBtn";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {SocialPanel} from "./Components/SIdeMenu/SocialPanel";
import {AboutMeTextIndex} from "./Components/AboutMeTextIndex";

function App() {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const sidebarRef = useRef(null);

    const handleMenuBtnClick = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const handleDocumentClick = (event) => {
        if (
            sidebarRef.current &&
            !sidebarRef.current.contains(event.target) &&
            !document.getElementById("SideBarIndex").contains(event.target)
        ) {
            setSidebarVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const MemoizedBackgroundParticles = useMemo(() => {
        return React.memo(BackgroundParticles);
    }, []);

  return (
      <div className="App">
          <div className="MainWrapper" style={{height: '100vh'}}>
              <div className="SideWrapper" ref={sidebarRef}>
                  <MenuBtn onClick={handleMenuBtnClick} useRef={sidebarRef} />
                  <SocialPanel />
              </div>
              <SideBarMenu isVisible={isSidebarVisible} setSidebarVisible={setSidebarVisible} />
              <AboutMeTextIndex />
              <MemoizedBackgroundParticles />
          </div>
      </div>
  );
}

export default App;
