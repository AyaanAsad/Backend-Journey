import { Router } from 'express'
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middle.js"
import { verifyJWT } from '../middlewares/auth.middle.js'

const router = Router()
router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "covrImg",
            maxCount: 1
        }
    ]),
    registerUser)

router.route('/login').post(
    loginUser
)

//SECURED ROUTES:

router.route('/logout').post( verifyJWT,
    logoutUser
)

router.route('/refreshToken').post(refreshAccessToken)
export default router