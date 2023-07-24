import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBBtn,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBCollapse,
} from 'mdb-react-ui-kit';

function Header(props) {
    const { signedIn } = props
    const [showBasic, setShowBasic] = useState(false);

    return (
        <MDBNavbar expand='lg' light bgColor='light'>
            <MDBContainer fluid>
                <MDBNavbarBrand href='#'>PodCast<i>le</i></MDBNavbarBrand>

                <MDBNavbarToggler
                    aria-controls='navbarSupportedContent'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                    onClick={() => setShowBasic(!showBasic)}
                >
                    <MDBIcon icon='bars' fas />
                </MDBNavbarToggler>

                <MDBCollapse navbar show={showBasic}>
                    <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
                        <MDBNavbarItem>
                            <Link to="/">
                                Home
                           </Link>
                        </MDBNavbarItem>

                        

                        <MDBNavbarItem>
                            <MDBDropdown>
                                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                                    Genres
                                </MDBDropdownToggle>
                                <MDBDropdownMenu>
                                    <MDBDropdownItem link>Sign in</MDBDropdownItem>
                                    <MDBDropdownItem link>Another action</MDBDropdownItem>
                                    <MDBDropdownItem link>Something else here</MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavbarItem>

                        <MDBNavbarItem>
                            {signedIn ? <MDBNavbarItem>
                                <MDBNavbarLink href='#'>Favorites</MDBNavbarLink>
                            </MDBNavbarItem> : <MDBNavbarLink disabled href='#' tabIndex={-1} aria-disabled='true'>
                                Please sign in to view Favorites
                            </MDBNavbarLink>}

                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='#'>{signedIn ? 'Sign out' : 'Sign in'}</MDBNavbarLink>
                        </MDBNavbarItem>
                    </MDBNavbarNav>

                    <form className='d-flex input-group w-auto'>
                        <input type='search' className='form-control' placeholder='Looking for something?' aria-label='Search' />
                        <MDBBtn color='primary'>Search</MDBBtn>
                    </form>
                </MDBCollapse>

            </MDBContainer>
        </MDBNavbar>
    );
}
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

export default Header;


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