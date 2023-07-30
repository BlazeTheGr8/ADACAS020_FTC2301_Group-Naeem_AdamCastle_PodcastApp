// @ts-nocheck

import React from "react";
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

function Header(props) {
  const { signedIn } = props;
  const [showBasic, setShowBasic] = useState(false);

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleFavoritesClick = () => {
    navigate("/favorites");
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
//     return (
//         //   <header classNameName="header-container">
//         //     <div classNameName="header-content">
//         //       <div classNameName="logo-container">
//         //         <img
//         //           src="/path/to/your/app-logo.png"
//         //           alt="Podcastify Logo"
//         //           classNameName="app-logo"
//         //         />
//         //         <h1 classNameName="app-name">Podcastify</h1>
//         //       </div>
//         //       <Link to="/favorites" classNameName="btn btn-danger">
//         //         Favorites
//         //       </Link>
//         //     </div>
//         //   </header>
//         <header>
//             {/* <!-- Navbar --> */}
//             <nav className="navbar navbar-expand-lg navbar-light bg-white">
//                 <div className="container-fluid">
//                     <button
//                         className="navbar-toggler"
//                         type="button"
//                         data-mdb-toggle="collapse"
//                         data-mdb-target="#navbarExample01"
//                         aria-controls="navbarExample01"
//                         aria-expanded="false"
//                         aria-label="Toggle navigation"
//                     >
//                         <i className="fas fa-bars"></i>
//                     </button>
//                     <div className="collapse navbar-collapse" id="navbarExample01">
//                         <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                             <li className="nav-item active">
//                                 <a className="nav-link" aria-current="page" href="#">Home</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#">Features</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#">Pricing</a>
//                             </li>
//                             <li className="nav-item">
//                                 <a className="nav-link" href="#">About</a>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </nav>
//             {/* <!-- Navbar --> */}

//             {/* <!-- Jumbotron --> */}
//             <div className="p-5 text-center bg-light">
//                 <h1 className="mb-3">Heading</h1>
//                 <h4 className="mb-3">Subheading</h4>
//                 <a className="btn btn-primary" href="" role="button">Call to action</a>
//             </div>
//             {/* <!-- Jumbotron --> */}
//         </header>
//     );
// };

//   <div classNameName='container-fluid'>
//     <div classNameName='row'>
//       <div classNameName='col-xs-6'><img
//           // src="../src/assets/podcast-logo.png"
//           alt="Podcastify Logo"
//           classNameName="app-logo img-responsive"
//         /></div>
//       <div classNameName='col-xs-6'><h1 classNameName="app-name">Podcastify</h1></div>
//     </div>
//     <button classNameName='btn btn-primary'>Hello</button>
//   </div>
