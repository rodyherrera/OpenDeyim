/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * The OpenDeyim Source Code
 * A free, modern, self-hosted and open source translation service that instantly 
 * translates phrases, words and web pages into more than 30 languages. Use our 
 * API or bindings and experiment with OpenDeyim.
 * 
 * For more information, please read the documentation inside 
 * the <README.md> file which is located at the root of this directory or source code.
 * 
 * (www.github.com/codewithrodi/OpenDeyim/)
 * 
 * Rodolfo Herrera Hernandez <contact@codewithrodi.com>.
 * Full Stack Software Developer.
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/

import React from 'react';
import ReactDOM from 'react-dom/client';
import * as ServiceWorkerRegistration from './ServiceWorkerRegistration';
import ReportWebVitals from './ReportWebVitals';
import Application from './Application';
import ScrollToTop from './Components/General/ScrollToTop';
import SuccessAlert from './Components/General/SuccessAlert';
import * as MaterialUI from '@mui/material/styles';
import { Provider as AlertProvider } from 'react-alert';
import { BrowserRouter } from 'react-router-dom';
import { MultiProvider } from 'react-pendulum';
import { TranslatorProvider } from './Services/Translator/Context';
import './Assets/StyleSheets/General.css';
import 'custom-cursor-react/dist/index.css';
import './Patches/SpeechSynthesisVoices';

const MaterialTheme = MaterialUI.createTheme({
    palette: {
        primary: {
            main: '#000000'
        },
        secondary: {
            main: '#FFFFFF'
        }
    }
});

const AlertTemplate = ({ options }) => (
    (options.type === 'success') && (<SuccessAlert />)
);  

ReactDOM.createRoot(document.getElementById('OpenDeyim-Root')).render(
    <MultiProvider
        providers={[
            <BrowserRouter />,
            <TranslatorProvider />,
            <ScrollToTop />,
            <AlertProvider template={AlertTemplate} />,
            <MaterialUI.ThemeProvider theme={MaterialTheme} />
        ]}
    >
        <Application />
    </MultiProvider>
);

ServiceWorkerRegistration.register();
ReportWebVitals();