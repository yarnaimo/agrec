import { createReadStream } from 'fs'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { basename } from 'path'
import { log } from './log'

let oauth2Client: OAuth2Client | undefined

export const uploadToDrive = async (path: string, driveFolder: string) => {
    if (!oauth2Client) {
        const { installed } = require('../../.data/credentials.json')
        const { refresh_token } = require('../../.data/token.json')

        oauth2Client = new google.auth.OAuth2(
            installed.client_id,
            installed.client_secret,
            installed.redirect_uris[0],
        )
        oauth2Client.setCredentials({
            refresh_token,
        })
    }

    const name = basename(path)

    const drive = google.drive({ version: 'v3', auth: oauth2Client! })
    await drive.files.create({
        requestBody: {
            parents: [driveFolder],
            name,
        },
        media: {
            body: createReadStream(path),
        },
    })
    log(`${path} をアップロードしました`)
}
