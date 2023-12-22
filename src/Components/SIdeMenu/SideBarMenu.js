
export function SideBarMenu({ isVisible }) {
    const sidebarClasses = `SideBarMenu ${isVisible ? 'visible' : ''}`;
    const hideRestPageClasses = `HideRestPage ${isVisible ? 'HidePage' : ''}`

    return (
        <>
            <div className={sidebarClasses} id="SideBarIndex">

            </div>
            <div className={hideRestPageClasses}>

            </div>
        </>
    )
}