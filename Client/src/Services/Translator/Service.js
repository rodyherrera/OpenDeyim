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

import { GenericRequestToBackend } from '../../Utilities/Runtime';

const TranslatorPersistentStorageID = 'OPENDEYIM_TRANSLATOR_SERVICE';

export const StoredTranslatorData = () =>
    JSON.parse(localStorage.getItem(TranslatorPersistentStorageID)) || {};

export const StoreTranslatorData = (Data) => 
    localStorage.setItem(TranslatorPersistentStorageID, JSON.stringify(Data));

export const RetrieveFrontendSettings = () =>
    GenericRequestToBackend({ Path: '/' });

export const RetrieveOperativeLanguages = () =>
    GenericRequestToBackend({ Path: 'languages' });

export const Translate = (Body) => 
    GenericRequestToBackend({
        Path: 'translate',
        Method: 'POST',
        Body
    });