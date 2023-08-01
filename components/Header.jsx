// @ts-nocheck

import React, { useEffect } from "react";
import { useState } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

function Header(props) {

  const [userId, setUserId] = useState('') 
  const { signedIn } = props;
  const [showBasic, setShowBasic] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getUserAndLog() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUserId(user.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    getUserAndLog();
  }, []);

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleFavoritesClick = () => {
    navigate(`/favorites/${userId}`);
  };

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer fluid>
        <MDBNavbarBrand href="#">
          PodCast<i>le</i>
        </MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
            <MDBNavbarItem>
              <MDBNavbarLink onClick={handleHomeClick}>Home</MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
              {signedIn ? (
                <MDBNavbarLink onClick={handleFavoritesClick}>Favorites</MDBNavbarLink>
              ) : (
                <MDBNavbarLink
                  disabled
                  href="#"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  Please sign in to view Favorites
                </MDBNavbarLink>
              )}
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink href="/login">
                {signedIn ? "Sign out" : "Sign in"}
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default Header;
