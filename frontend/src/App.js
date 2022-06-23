import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import DvorahDailyScreen from './screens/DvorahDailyScreen';
import DevotionalScreen from './screens/DevotionalScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { DropdownSubmenu, NavDropdownMenu } from 'react-bootstrap-submenu';
import 'react-bootstrap-submenu/dist/index.css';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import SellerRoute from './components/SellerRoute';
import DevotionalListScreen from './screens/DevotionalListScreen'; //WIP - moet nou die screen bou!
import DevotionalEditScreen from './screens/DevotionalEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';
import Logo from './dvorahBeefreeEdit.png';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand>
                  <img src={Logo} alt="bee free" />
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto  w-100  justify-content-end">
                  <NavDropdownMenu title="READ" id="collasible-nav-dropdown">
                    <LinkContainer to="/read/dvorahdaily">
                      <NavDropdown.Item>Dvorah Daily</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <DropdownSubmenu
                      href="#action/3.7"
                      title="Solly Ozrovech&nbsp;"
                    >
                      <NavDropdown.Item href="/read/sollyozrovech/about">
                        About
                      </NavDropdown.Item>

                      <NavDropdown.Item href="#action/9.1">
                        Die reisiger se Bybeljoernaal
                      </NavDropdown.Item>
                    </DropdownSubmenu>
                    <LinkContainer to="/read/bybelskool">
                      <NavDropdown.Item>Bybelskool</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/read/about">
                      <NavDropdown.Item>About</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdownMenu>

                  <NavDropdown title="EAT" id="basic-nav-dropdown">
                    <LinkContainer to="/recipe planner">
                      <NavDropdown.Item>Recipe Planner</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/honey">
                      <NavDropdown.Item>Honey</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/herbs">
                      <NavDropdown.Item>Herbs</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/recipes">
                      <NavDropdown.Item>Recipes</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                  <NavDropdown title="EXERCISE" id="basic-nav-dropdown">
                    <LinkContainer to="/exercise">
                      <NavDropdown.Item>Daily Exercise</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/praisemoves">
                      <NavDropdown.Item>Praise Moves</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                  <NavDropdown title="ORGANISE" id="basic-nav-dropdown">
                    <LinkContainer to="/calendar">
                      <NavDropdown.Item>Calendar</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/organiseinfo">
                      <NavDropdown.Item>Info</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <Link to="/cart" className="dropdown-item">
                        Cart
                        {cart.cartItems.length > 0 && (
                          <Badge pill bg="danger">
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )}
                      </Link>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>

                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isSeller && (
                    <NavDropdown title="Seller" id="seller-nav-dropdown">
                      <LinkContainer to="/seller/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/seller/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/devotionals">
                        <NavDropdown.Item>Devotionals</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/devotionals"
                element={
                  <AdminRoute>
                    <DevotionalListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/devotional/:id"
                element={
                  <AdminRoute>
                    <DevotionalEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              {/* Seller Routes */}
              <Route
                path="/seller/products"
                element={
                  <SellerRoute>
                    <ProductListScreen />
                  </SellerRoute>
                }
              ></Route>
              <Route
                path="/seller/orders"
                element={
                  <SellerRoute>
                    <OrderListScreen />
                  </SellerRoute>
                }
              ></Route>
              <Route path="read/dvorahdaily" element={<DvorahDailyScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
