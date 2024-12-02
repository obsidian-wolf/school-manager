/**
 * This fetches the swagger definition file on the server, copies it locally,
 * and runs "orval" to automatically generate the "react-query" definitions.
 */
import axios from 'axios';
import { writeFileSync, unlinkSync } from 'fs';
import { exec } from 'child_process';
import { Agent } from 'https';

function asyncExec(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else if (stderr && !stderr.includes('[WARNING]')) {
                reject(error);
            } else if (stdout?.toString().toLowerCase().includes('error')) {
                reject(stdout);
            } else {
                resolve(stdout);
            }
        });
    });
}

async function getSwaggerDoc() {
    const API_HOST = 'http://localhost:3000';

    const agent = new Agent({
        rejectUnauthorized: false,
    });

    const { data } = await axios.get(`${API_HOST}/swagger.json`, {
        httpsAgent: agent,
    });

    writeFileSync('swagger.json', JSON.stringify(data), 'utf8');

    /*
     */

    const API_HOST_2 = 'http://localhost:5001';

    const { data: data2 } = await axios.get(`${API_HOST_2}/swagger.json`, {
        httpsAgent: agent,
    });

    writeFileSync('swagger2.json', JSON.stringify(data2), 'utf8');

    /*
     */

    await asyncExec('orval');

    await unlinkSync('swagger.json');

    await unlinkSync('swagger2.json');
}

async function syncApi() {
    try {
        console.log('Attempting to sync api...');
        await getSwaggerDoc();
        console.log('Sync succeeded');
    } catch (err) {
        console.log('Sync failed: ', err);
    }
}

syncApi();
