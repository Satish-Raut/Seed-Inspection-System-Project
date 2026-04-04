import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { InspectionProvider } from './context/InspectionContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SelectCrop from './pages/inspection/SelectCrop'
import ProductionType from './pages/inspection/ProductionType'
import FieldRegistration from './pages/inspection/FieldRegistration'
import StagesOverview from './pages/inspection/StagesOverview'
import InspectionForm from './pages/inspection/InspectionForm'
import Report from './pages/inspection/Report'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

/**
 * Root Layout Component (acting as Home from the sample)
 * Wraps all children with Context Providers and an Outlet
 */
function Home() {
  return (
    <AuthProvider>
      <InspectionProvider>
        <Outlet />
      </InspectionProvider>
    </AuthProvider>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "inspection/:id",
        children: [
          {
            path: "crop",
            element: <ProtectedRoute><SelectCrop /></ProtectedRoute>,
          },
          {
            path: "production",
            element: <ProtectedRoute><ProductionType /></ProtectedRoute>,
          },
          {
            path: "field",
            element: <ProtectedRoute><FieldRegistration /></ProtectedRoute>,
          },
          // Semantic Overview Route
          {
            path: ":crop/:type/stages",
            element: <ProtectedRoute><StagesOverview /></ProtectedRoute>,
          },
          // Modern semantic route for specific crop and stage
          {
            path: ":crop/:type/stage/:stageNumber",
            element: <ProtectedRoute><InspectionForm /></ProtectedRoute>,
          },
          // Semantic Report Route
          {
            path: ":crop/:type/report",
            element: <ProtectedRoute><Report /></ProtectedRoute>,
          },
        ]
      },
      {
        path: "reports",
        element: <ProtectedRoute><Reports /></ProtectedRoute>,
      },
      {
        path: "settings",
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App