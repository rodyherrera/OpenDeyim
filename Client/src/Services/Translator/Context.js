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

import React, { createContext, useEffect, useState } from 'react';
import { MakeServerRequest } from '../../Utilities/Runtime';
import { useLocation } from 'react-router-dom';
import { MergeObjectValues } from '../../Utilities/Algorithms';
import * as Service from './Service';

export const TranslatorContext = createContext();

export const TranslatorProvider = ({ children }) => {
    const [GetTranslatorSettings, SetTranslatorSettings] = useState(Service.StoredTranslatorData()?.TranslatorSettings || {});
    const [GetIsTranslatorSettingsLoading, SetIsTranslatorSettingsLoading] = useState(true);
    const [GetOperativeLanguages, SetOperativeLanguages] = useState(Service.StoredTranslatorData()?.OperativeLanguages || []);
    const [GetAvailablesLanguages, SetAvailablesLanguages] = useState(GetOperativeLanguages.map(({ Code }) => (Code)));
    const [GetIsOperativeLanguagesLoading, SetIsOperativeLanguagesLoading] = useState(true);
    const [GetTranslationHistory, SetTranslationHistory] = useState(Service.StoredTranslatorData()?.History || []);
    const [GetServerExchangeBuffer, SetServerExchangeBuffer] = useState({});
    const Location = useLocation();

    const GetAvailablesTargetsForLanguage = (LanguageCode) => {
        (LanguageCode === 'auto') && (LanguageCode = 'en');
        return (GetOperativeLanguages.find((OperativeLanguage) => OperativeLanguage.Code === LanguageCode))?.Targets || [];
    }

    const HandleStoredTranslationDelete = (ToDeleteTranslation) =>
        SetTranslationHistory((CurrentTranslationHistory) => CurrentTranslationHistory.filter(
            (MappedTranslation) => ToDeleteTranslation.TranslatedText !== MappedTranslation.TranslatedText));

    const Translate = (Body) => 
        MakeServerRequest({ Callback: Service.Translate, Arguments: [Body] });
    
    const StartTranslatorServiceBasis = async () => {
        try{
            SetIsTranslatorSettingsLoading(true);
            const { Data: TranslatorSettings } = await MakeServerRequest({
                Callback: Service.RetrieveFrontendSettings });
            Service.StoreTranslatorData(MergeObjectValues(
                Service.StoredTranslatorData(), { TranslatorSettings }));
            SetTranslatorSettings(TranslatorSettings);
        }finally{
            SetIsTranslatorSettingsLoading(false);
        }
        try{
            SetIsOperativeLanguagesLoading(true);
            const { Data: OperativeLanguages } = await MakeServerRequest({
                Callback: Service.RetrieveOperativeLanguages });
            Service.StoreTranslatorData(MergeObjectValues(
                Service.StoredTranslatorData(), { OperativeLanguages }));  
            SetOperativeLanguages(OperativeLanguages);
        }finally{
            SetIsOperativeLanguagesLoading(false);
        }
    };

    useEffect(() => {
        (GetOperativeLanguages.length >= 1) 
            && (SetAvailablesLanguages((GetOperativeLanguages.map(({ Code }) => (Code)))));
    }, [GetOperativeLanguages]);

    useEffect(() => {
        StartTranslatorServiceBasis();
        return () => {
            SetTranslatorSettings({});
            SetIsTranslatorSettingsLoading(false);
            SetOperativeLanguages([]);
            SetTranslationHistory({});
            SetIsOperativeLanguagesLoading(false);
            SetServerExchangeBuffer({});
            SetAvailablesLanguages([]);
        };
    }, []);

    useEffect(() => {
        SetServerExchangeBuffer({});
    }, [Location]);

    useEffect(() => {  
        const Buffer = Service.StoredTranslatorData();
        Buffer.History = GetTranslationHistory;
        Service.StoreTranslatorData(Buffer);
        SetServerExchangeBuffer(GetTranslationHistory[0] || {});
    }, [GetTranslationHistory]);

    return (
        <TranslatorContext.Provider
            value={{
                GetIsTranslatorSettingsLoading,
                GetIsOperativeLanguagesLoading,
                GetServerExchangeBuffer,
                GetTranslatorSettings,
                GetAvailablesLanguages,
                GetAvailablesTargetsForLanguage,
                GetTranslationHistory,
                SetServerExchangeBuffer,
                SetTranslationHistory,
                HandleStoredTranslationDelete,
                Translate
            }}
        >
            {children}
        </TranslatorContext.Provider>
    )
};