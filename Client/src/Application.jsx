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
import { Routes as RoutesBox, Route, useLocation } from 'react-router-dom';
import Layout from './Components/General/Layout';
import EverybodyPages from './Pages/Everybody';

const Application = () => {
    const Location = useLocation();

    return (
        <RoutesBox location={Location} key={Location.pathname}>
            <Route element={<Layout />}>
                <Route path='/' exact element={<EverybodyPages.HomePage />} />
                <Route path='/terms-and-policies-of-use' element={<EverybodyPages.PoliciesPage />} />
                <Route path='*' element={<EverybodyPages.NotFoundPage />} />
            </Route>
        </RoutesBox>
    );
};

export default Application;