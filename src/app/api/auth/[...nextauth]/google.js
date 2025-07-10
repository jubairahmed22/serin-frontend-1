import axios from '../../../lib/axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, googleId, image } = req.body

    // Check if user exists
    const checkUser = await axios.post('/api/auth/check-user', { email })
    
    let user
    if (checkUser.data.exists) {
      // User exists, log them in
      const loginResponse = await axios.post('/api/auth/login', {
        email,
        password: googleId // Using googleId as password for social login
      })
      user = loginResponse.data
    } else {
      // Create new user
      const registerResponse = await axios.post('/api/auth/register', {
        name,
        email,
        password: googleId, // Using googleId as password
        isSocialLogin: true
      })
      user = registerResponse.data
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('Google auth error:', error.response?.data || error.message)
    return res.status(500).json({
      message: error.response?.data?.message || 'Google authentication failed'
    })
  }
}