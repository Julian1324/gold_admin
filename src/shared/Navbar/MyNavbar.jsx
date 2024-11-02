import { Navbar, Nav, Container, Form, FormControl, Button, NavDropdown, Image } from 'react-bootstrap';
import { assets } from '../../assets/assets';
import './MyNavbar.css';

function MyNavbar() {

    return (
        <Navbar fixed="top" className="header d-flex align-items-center" expand="lg">
            <Container fluid>
                <Navbar.Brand href="./home" className="d-flex align-items-center">
                    <Image src={assets['goldServiceLogo']} alt="" className="me-2" style={{width: '5rem'}} />
                    <span className="d-none d-lg-block">Gold Admin</span>
                </Navbar.Brand>
                <i className="bi bi-list toggle-sidebar-btn"></i>
                <Navbar.Collapse id="navbar-nav">
                    <Form className="d-flex search-bar ms-auto" action="." method="POST">
                        <FormControl
                            type="text"
                            placeholder="Search"
                            name="query"
                            className="me-2"
                            title="Enter search keyword"
                        />
                        <Button variant="outline-secondary" title="Search">
                            <i className="bi bi-search"></i>
                        </Button>
                    </Form>
                    <Nav className="ms-auto">
                        <NavDropdown
                            title={
                                <div className='d-flex align-items-center'>
                                    <Image src={assets['profile']} style={{ width: '2rem' }} roundedCircle className="me-2" />
                                    <span className="d-none d-md-block">K. Anderson</span>
                                </div>
                            }
                            id="profile-dropdown"
                            style={{width: '11rem'}}
                        >
                            <NavDropdown.Header>
                                <h6>Kevin Anderson</h6>
                                <span>Gold Admin</span>
                            </NavDropdown.Header>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="users-profile.html"><i className="bi bi-person"></i> My Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="users-profile.html"><i className="bi bi-gear"></i> Account Settings</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="pages-faq.html"><i className="bi bi-question-circle"></i> Need Help?</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="."><i className="bi bi-box-arrow-right"></i> Sign Out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;