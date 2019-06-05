import * as Crypto from "crypto";
import {SettingsCrypto as CryptoSttng} from "../settings/settings";

export interface ICipher {
    Cipher:Object,
    Auth:Object
};

interface IDecipher extends ICipher{

}

export default new class Safe {
    private password;
    private IV;
    private AAD;
    

    constructor() { 
        this.password = CryptoSttng.key;
        this.IV = Crypto.randomBytes(12);
        this.AAD = Buffer.from('0123456789', 'hex');
    }

    public encrypt(data:Object):ICipher { 
        try {
            const cipher:Crypto.CipherCCM = Crypto
            .createCipheriv
            (
                'aes-192-ccm', 
                this.password, 
                this.IV, 
                {
                    authTagLength: 16
                }
            );
            const ToDataText = JSON.stringify(data); 
            cipher.setAAD(
                this.AAD, 
                {
                    plaintextLength: Buffer.byteLength(ToDataText)
                }
            );
            const ciphertext = cipher.update(ToDataText, 'utf8');
            cipher.final();
            let Auth = JSON.stringify(cipher.getAuthTag());
            let Cipher = JSON.stringify(ciphertext);
            return {Cipher,Auth};
        } catch (exception) {
            throw new Error(exception.message);
        }
    }

    public decrypt(Cipher:string,Auth:string):JSON|Error { 
        const 
            AuthKey = Buffer.from(Auth),
            CipherData = Buffer.from(Cipher),
            decipher = Crypto.createDecipheriv(
                'aes-192-ccm', 
                this.password, 
                this.IV, 
                {
                    authTagLength: 16
                }
            );
        decipher.setAuthTag(AuthKey);
        decipher.setAAD(
            this.AAD, 
            {
                plaintextLength: CipherData.length
            }
        );

        let _Decipher = decipher.update(CipherData, null, 'utf8');
        try {
            decipher.final();
        } catch (error) {
            return error;
        }
        return JSON.parse(_Decipher);
    }
}