import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/" activeStyle>
                        About
                    </NavLink>
                    <NavLink to="/register_guardians" activeStyle>
                        Register Social Recover Guardians
                    </NavLink>
                    <NavLink to="/social_recovery" activeStyle>
                        Start Social Recovery
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;