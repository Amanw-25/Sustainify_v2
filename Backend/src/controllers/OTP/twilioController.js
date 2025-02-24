import twilio from 'twilio';
import appConfig from '../../config/appConfig.js';



const accountSid = appConfig.TWILIO_ACCOUNT_SID;
const authToken = appConfig.TWILIO_AUTH_TOKEN;
const verifySid = appConfig.TWILIO_VERIFY_SERVICE_SID;


const client = twilio(accountSid, authToken);

export const sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const verification = await client.verify.v2
            .services(verifySid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });

        res.json({
            success: true,
            message: 'Verification code sent successfully',
            status: verification.status
        });

    } catch (error) {
        console.error('Error sending verification:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending verification code',
            error: error.message
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;

        if (!phoneNumber || !code) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and verification code are required'
            });
        }

        const verificationCheck = await client.verify.v2
            .services(verifySid)
            .verificationChecks
            .create({ to: phoneNumber, code });

        if (verificationCheck.status === 'approved') {
            res.json({
                success: true,
                message: 'Verification successful',
                status: verificationCheck.status
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid verification code',
                status: verificationCheck.status
            });
        }

    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying code',
            error: error.message
        });
    }
};