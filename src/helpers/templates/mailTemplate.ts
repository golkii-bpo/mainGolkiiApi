
export const mailPwdResetTemplate = (linkReset:string,cancelLink:string=''):string => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="format-detection" content="telephone=no"> <meta name="x-apple-disable-message-reformatting"> <title></title> <style type="text/css"> @media screen{@font-face{font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}@font-face{font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;}@font-face{font-family: 'Fira Sans'; font-style: normal; font-weight: 500; src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}@font-face{font-family: 'Fira Sans'; font-style: normal; font-weight: 500; src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;}@font-face{font-family: 'Fira Sans'; font-style: normal; font-weight: 700; src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}@font-face{font-family: 'Fira Sans'; font-style: normal; font-weight: 700; src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;}@font-face{font-family: 'Fira Sans'; font-style: normal; font-weight: 800; src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}@font-face{font-family: 'Fira Sans'; font-style: normal; font-weight: 800; src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;}}#outlook a{padding: 0;}.ReadMsgBody, .ExternalClass{width: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font{line-height: 100%;}div[style*="margin: 14px 0"], div[style*="margin: 16px 0"]{margin: 0 !important;}table, td{mso-table-lspace: 0; mso-table-rspace: 0;}table, tr, td{border-collapse: collapse;}body, td, th, p, div, li, a, span{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-line-height-rule: exactly;}img{border: 0; outline: none; line-height: 100%; text-decoration: none; -ms-interpolation-mode: bicubic;}a[x-apple-data-detectors]{color: inherit !important; text-decoration: none !important;}body{margin: 0; padding: 0; width: 100% !important; -webkit-font-smoothing: antialiased;}.pc-gmail-fix{display: none; display: none !important;}@media screen and (min-width: 621px){.pc-email-container{width: 620px !important;}}@media screen and (max-width:620px){.pc-sm-p-30{padding: 30px !important}.pc-sm-p-30-25{padding: 30px 25px !important}.pc-sm-p-25{padding: 25px !important}.pc-sm-mw-100pc{max-width: 100% !important}.pc-sm-m-0-auto{margin: 0 auto !important}.pc-sm-ta-center{text-align: center !important}.pc-sm-p-35-30{padding: 35px 30px !important}}@media screen and (max-width:525px){.pc-xs-p-20{padding: 20px !important}.pc-xs-p-20-15{padding: 20px 15px !important}.pc-xs-p-15{padding: 15px !important}.pc-xs-p-25-20{padding: 25px 20px !important}.pc-xs-fs-30{font-size: 30px !important}.pc-xs-lh-42{line-height: 42px !important}.pc-xs-br-disabled br{display: none !important}}</style></head><body style="width: 100% !important; margin: 0; padding: 0; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f4f4f4" class=""> <span style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Recuperación de la contraseña de la cuenta - </span> <table class="pc-email-body" role="presentation" style="table-layout: fixed;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td class="pc-email-body-inner" valign="top" align="center"><!--[if gte mso 9]> <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" src="" color="#f4f4f4"/> </v:background><![endif]--> <table class="pc-email-container" role="presentation" style="margin: 0 auto; max-width: 620px;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center"> <tbody> <tr> <td style="padding: 0 10px;" valign="top" align="left"> <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td style="font-size: 1px; line-height: 1px;" height="20">&nbsp;</td></tr></tbody> </table> <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td class="pc-sm-p-35-30 pc-xs-p-25-20" style="padding: 40px 30px 32px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)" valign="top" bgcolor="#ffffff"> <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td class="pc-xs-fs-30 pc-xs-lh-42 pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 900; line-height: 46px; letter-spacing: -0.6px; color: #2d3a4c; text-align: center" valign="top">GOLKII BPO</td></tr><tr> <td style="font-size: 1px; line-height: 1px" height="25">&nbsp;</td></tr></tbody> <tbody> <tr> <td class="pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 300; line-height: 28px; color: #9B9B9B; text-align: center" valign="top"> <div style="text-align: center;">Este es un link que te permite restablecer tu contraseña. Usted tendra un tiempo maximo de 30 min para poder restablecer&nbsp; la contraseña de lo contrario este correo electronico no será valido. Si usted no ha solicitado este link favor ir a este <a style="color: #ffd800;" title="Aqui" href="${cancelLink}">vinculo</a></div></td></tr><tr> <td style="font-size: 1px; line-height: 1px" height="9">&nbsp;</td></tr></tbody> <tbody> <tr> <td style="padding: 8px 0;" valign="top" align="center"> <table role="presentation" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td style="padding: 13px 17px; background-color: #2d3a4c; border-radius: 7px" valign="top" bgcolor="#2d3a4c" align="center"> <a class="pc-fb-font" href="${linkReset}" style="line-height: 1.5; text-decoration: none; word-break: break-word; font-weight: 500; display: block; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff;">Restablecer</a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td style="font-size: 1px; line-height: 1px;" height="20">&nbsp;</td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div></body></html>`
}