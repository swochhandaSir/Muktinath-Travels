import {BrowserRouter, Routes, Route, Navigate} from 'react-router'
import Home from '../pages/Home'
import About from '../pages/About'
import Bikes from '../pages/Bikes'
import Blog from '../pages/Blog'
import Contact from '../pages/Contact'
import Package from '../pages/Package'
import Service from '../pages/Service'
import MainLayout from '../layouts/MainLayout'

function AppRouter() {
    return (
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout/>}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/bikes" element={<Bikes />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/package" element={<Package />} />
                        <Route path="/service" element={<Service />} />
                    </Route>
                </Routes>
            </BrowserRouter>
    )}

    export default AppRouter