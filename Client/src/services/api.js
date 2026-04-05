import axios from 'axios'

/**
 * Configure the Base API URL
 * In development, it points to localhost:5000/api
 * In production, it will use the environment variable VITE_API_URL
 */
const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for sending httpOnly cookies (Refresh Token) 
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * ── REQUEST INTERCEPTOR ───────────────────────────────────────────────────
 * Automatically attaches the Access Token from localStorage to every request.
 */
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('si_user') || 'null')
  
  // We now expect the token to be in 'accessToken' field if using Dual Tokens
  const token = user?.accessToken || user?.token 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

/**
 * ── RESPONSE INTERCEPTOR (SILENT REFRESH) ──────────────────────────────────
 * Detects 401 errors, attempts to refresh the token, and retries the request.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // 1. Call refresh endpoint (browser will automatically send the refresh cookie)
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
        
        const newAccessToken = data.accessToken

        // 2. Update local storage with the new token
        const user = JSON.parse(localStorage.getItem('si_user') || '{}')
        user.accessToken = newAccessToken
        user.token = newAccessToken // Backward compatibility
        localStorage.setItem('si_user', JSON.stringify(user))

        // 3. Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh also fails, the session is truly dead -> Log out user
        console.error('Refresh Token failed or expired:', refreshError)
        localStorage.removeItem('si_user')
        // We let the components (like ProtectedRoute or AuthContext) handle state/redirects
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

/* ==========================================================================
   1. AUTHENTICATION API
   ========================================================================== */

/**
 * Register a new inspector
 * @param {Object} data - { name, email, password, phone, designation, region }
 * @returns {Promise} - Returns the newly created inspector and their token.
 */
export const registerInspector = (data) => api.post('/auth/register', data)

/**
 * Login an existing inspector
 * @param {Object} data - { email, password }
 * @returns {Promise} - Returns JWT token and inspector profile { name, id, inspectorId }.
 */
export const loginInspector = (data) => api.post('/auth/login', data)

/**
 * Get current profile from server based on token
 * @returns {Promise} - Returns the inspector's detailed database entry.
 */
export const getMe = () => api.get('/auth/me')

/**
 * Logout the inspector (clears backend cookie)
 * @returns {Promise}
 */
export const logoutInspector = () => api.post('/auth/logout')


/* ==========================================================================
   2. INSPECTION LIFECYCLE API
   ========================================================================== */

/**
 * Create a new inspection record
 * @param {Object} data - { cropType, productionType, totalStages }
 * @returns {Promise} - Returns the unique internal ID (e.g. { id: 101, ... }).
 */
export const createInspection = (data) => api.post('/inspections', data)

/**
 * Update an existing inspection shell
 * @param {number} id - The database ID
 * @param {Object} data - { cropType, productionType, totalStages }
 */
export const updateInspection = (id, data) => api.put(`/inspections/${id}`, data)

/**
 * Get all past inspections for the logged-in inspector
 * @returns {Promise} - Returns an array of inspection summary objects.
 */
export const getMyInspections = () => api.get('/inspections')

/**
 * Get full details of a specific inspection session
 * @param {string} id - The database ID or generated INS string
 * @returns {Promise} - Returns the inspection, its stages, and field info.
 */
export const getInspectionById = (id) => api.get(`/inspections/${id}`)

/**
 * Save field registration data for an inspection
 * @param {string} id - Inspection ID
 * @param {Object} data - { farmerName, farmerContact, fieldLocation, latitude, longitude, etc }
 * @returns {Promise} - Returns the updated field registration object.
 */
export const saveFieldRegistration = (id, data) => api.post(`/inspections/${id}/field`, data)


/* ==========================================================================
   3. STAGE DATA API
   ========================================================================== */

/**
 * Submit form data for a specific inspection stage
 * @param {string} id - Inspection ID
 * @param {Object} data - { stageNumber, stageName, data: { ...fields }, photos: [] }
 * @returns {Promise} - Returns the saved stage data record.
 */
export const submitStageData = (id, data) => api.post(`/inspections/${id}/stages`, data)

/**
 * Update existing stage data
 * @param {string} id - Inspection ID
 * @param {string} stageId - The record ID for that stage
 * @param {Object} data - Updated fields
 */
export const updateStageData = (id, stageId, data) => api.patch(`/inspections/${id}/stages/${stageId}`, data)


/* ==========================================================================
   4. REPORTS & SUBMISSION API
   ========================================================================== */

/**
 * Generate a final report record in the DB
 * @param {Object} data - { inspectionId, verdict, summaryNotes, pdfUrl }
 * @returns {Promise} - Returns the finalized report metadata.
 */
export const finalizeReport = (data) => api.post('/reports', data)

/**
 * Fetch all completed reports
 * @returns {Promise} - Returns an array of approved/rejected inspection certificates.
 */
export const getAllReports = () => api.get('/reports')

/**
 * Submit the final report to the authority via Email
 * @param {string} reportId - The DB ID of the report
 * @returns {Promise} - Returns a success message if the email was sent.
 */
export const submitReportToAuthority = (reportId) => api.post(`/reports/${reportId}/submit`)


/* ==========================================================================
   5. FILE & MEDIA UPLOADS
   ========================================================================== */

/**
 * Upload a photo directly to Cloudinary via backend
 * @param {FormData} formData - Multipart form containing the 'file'
 * @returns {Promise} - Returns { status: 'success', url: 'https://cloudinary.com/...' }.
 */
export const uploadImage = (formData) => api.post('/upload/image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

export default api
