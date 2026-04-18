import * as firebase from 'firebase-admin';
import { readFileSync } from 'fs';
import * as path from 'path';

const serviceAccountPath: string = path.resolve(__dirname, '../serviceAccount.json');

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, { encoding: 'utf8' }));

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});
export { firebase };
