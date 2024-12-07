require('dotenv').config();
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import DB from './database/DB';

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron'),
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        autoHideMenuBar: true, // Add this line to hide the menu bar
    });

    if (isDev) {
        // Wait for webpack dev server to be ready
        const loadURL = async () => {
            try {
                await win.loadURL('http://localhost:3000/#/');
                win.webContents.openDevTools({ mode: 'detach' });
            } catch (error) {
                console.error('Failed to load URL:', error);
                // Retry after a short delay
                setTimeout(loadURL, 1000);
            }
        };
        loadURL();
    } else {
        const indexPath = path.join(__dirname, '..', 'renderer', 'index.html');
        win.loadFile(indexPath).catch((error) => {
            console.error('Failed to load index.html:', error);
        });
    }
}

app.whenReady().then(() => {
    if (isDev) {
        // Give webpack dev server time to start
        setTimeout(createWindow, 2000);
    } else {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});