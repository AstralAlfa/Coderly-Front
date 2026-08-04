import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Feed from './pages/Feed';
import ProjectPage from './pages/ProjectPage';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import EditProfile from './pages/EditProfile';
import Requests from './pages/Requests';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className='blueprint-grid min-h-screen'>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Feed />} />
                        <Route path='/projects/:id' element={<ProjectPage />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='users/:username' element={<Profile />} />
                        <Route
                            path='/create'
                            element={
                                <ProtectedRoute>
                                    <CreateProject />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/projects/:id/edit'
                            element={
                                <ProtectedRoute>
                                    <EditProject />
                                </ProtectedRoute>
                            }
                        />
                        <Route path='/verify-email' element={<VerifyEmail />} />
                        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                        <Route path='/requests' element={<ProtectedRoute><Requests /></ProtectedRoute>} />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
