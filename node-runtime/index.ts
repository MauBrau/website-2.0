'use strict';
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const app = express();
import { Request, Response, NextFunction } from "express";
import { AxiosError, AxiosResponse } from "axios";

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

app.get('/api/weather/', (req: Request, res: Response, next: NextFunction) => {
    const lat = 45.5088;
    const lon = -73.5878;
    const APIkey = process.env.REACT_APP_WEATHER_API_KEY;
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`)
    .then((response: AxiosResponse) => {
        res.send(response.data);
    }).catch((error: AxiosError) => {
        next(error);
    });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('log: ' + req.path);
    if (/(.ico|.js|.css|.jpg|.png|.map|\/api\/)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
});


// Start the server
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

/**
 * Webpack HMR Activation
 */

type ModuleId = string | number;

interface WebpackHotModule {
    hot?: {
        data: any;
        accept(
            dependencies: string[],
            callback?: (updatedDependencies: ModuleId[]) => void,
        ): void;
        accept(dependency: string, callback?: () => void): void;
        accept(errHandler?: (err: Error) => void): void;
        dispose(callback: (data: any) => void): void;
    };
}

declare const module: WebpackHotModule;

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.close());
}