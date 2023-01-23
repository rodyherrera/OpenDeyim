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

import React, { useEffect, useState, useContext } from 'react';
import UseWindowSize from '../../../Hooks/WindowSize';
import Controls from './Controls/Controls';
import ISO6391 from 'iso-639-1';
import FormSkeleton from './Skeleton/';
import Loader from '../../General/Loader';
import LanguageSelection from './LanguageSelection';
import Fade from '../../General/Fade';
import IsHTML from 'is-html';
import { TranslatorContext } from '../../../Services/Translator/Context';
import { CgArrowsExchange } from 'react-icons/cg';
import { Button, IconButton, TextField } from '@mui/material';
import './Form.css';

const Form = () => {
    const {
        GetTranslatorSettings,
        GetAvailablesLanguages,
        GetIsTranslatorSettingsLoading,
        GetIsOperativeLanguagesLoading,
        GetAvailablesTargetsForLanguage,
        Translate,
        SetTranslationHistory } = useContext(TranslatorContext);
    const [Width] = UseWindowSize();
    const [GetSourceText, SetSourceText] = useState('');
    const [GetSourceLanguage, SetSourceLanguage] = useState(GetTranslatorSettings?.Language?.Source?.Code || 'es');
    const [GetTargetText, SetTargetText] = useState('');
    const [GetTargetLanguage, SetTargetLanguage] = useState(GetTranslatorSettings?.Language?.Target?.Code || 'en');
    const [GetDetectedLanguage, SetDetectedLanguage] = useState({});
    const [GetIsTranslationLoading, SetIsTranslationLoading] = useState(false);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetLanguagePositionWasExchanged, SetLanguagePositionWasExchanged] = useState(false);
    const [GetAvailableTargetLanguages, SetAvailableTargetLanguages] = useState(GetAvailablesTargetsForLanguage(GetSourceLanguage));

    useEffect(() => {
        if(!GetSourceText.length)
            return;
        const DelayDebounceFunction = setTimeout(() => 
            HandleFormSubmit(), GetTranslatorSettings.FrontendTimeout);
        return () => clearTimeout(DelayDebounceFunction);
    }, [GetSourceText]);

    useEffect(() => {
        if(GetIsTranslatorSettingsLoading || !Object.keys(GetTranslatorSettings).length)
            return;
        SetSourceLanguage(GetTranslatorSettings.Language.Source.Code);
        SetTargetLanguage(GetTranslatorSettings.Language.Target.Code);
    }, [GetIsTranslatorSettingsLoading, GetTranslatorSettings]);

    useEffect(() => {
        (GetSourceLanguage && !GetIsOperativeLanguagesLoading)
            && (SetAvailableTargetLanguages(
                    GetAvailablesTargetsForLanguage(GetSourceLanguage)))
    }, [GetSourceLanguage, GetIsOperativeLanguagesLoading]);

    useEffect(() => {
        /*
            ! The submission of the form will be executed, when a language change 
            ! in terms of the translation is detected, this change can be from the 
            ! Source or the  Target, but the detail is that, this will be done as long 
            ! as there is content in <GetSourceText> or <GetTargetText>.
            ! For example:
            ! Considering that the state variables have the following values:
                * -> GetSourceLanguage = 'es';
                * -> GetTargetLanguage = 'en';
                * -> GetSourceText = 'Hola mundo';
                * -> GetTargetText = 'Hello world';
            ! In the user interface through the language selector, the client 
            ! changes the language of the Target that is set to 'en' to 'de', 
            ! now, the translation will be done from Spanish to German, why?, 
            ! because a change was detected between one of the language states
            ! <GetSourceLanguage || GetTargetLanguage> and the state that stores 
            ! the translated text <GetTargetText> and the source <GetSourceText> 
            ! contains characters and passes the statement.
       */
       (GetSourceText && GetTargetText) && (HandleFormSubmit());
    }, [GetSourceLanguage, GetTargetLanguage]);

    const HandleFormSubmit = async (Event) => {
        if(GetLanguagePositionWasExchanged){
            SetLanguagePositionWasExchanged(false);
            return;
        }
        (Event) && (Event.preventDefault());
        const RequestData = {
            Query: GetSourceText.trim(),    
            Source: GetSourceLanguage,
            Target: GetTargetLanguage,
            Format: IsHTML(GetSourceText) ? ('html') : ('text')
        };
        try{
            SetDetectedLanguage({});
            SetIsTranslationLoading(true);
            const { Data } = await Translate(RequestData);
            if(!GetIsComponentMounted)
                return;
            SetTargetText(Data.TranslatedText);
            SetDetectedLanguage(Data?.DetectedLanguage || {});
            SetTranslationHistory((CurrentTranslationHistory) => {
                const Historial = [{
                    ...RequestData,
                    ...Data,
                    At: new Date()
                }, ...CurrentTranslationHistory];
                return [...new Map(Historial.map((Item) => [Item['TranslatedText'], Item])).values()];
            });
        }finally{
            (GetIsComponentMounted) && (SetIsTranslationLoading(false));
        }
    };

    useEffect(() => {
        if(!GetLanguagePositionWasExchanged)
            return;
        const [
            TargetLanguage,
            TargetText,
            SourceLanguage,
            SourceText
        ] = [
            GetTargetLanguage,
            GetTargetText,
            GetSourceLanguage,
            GetSourceText
        ];
        SetSourceLanguage(TargetLanguage);
        SetSourceText(TargetText);
        SetTargetLanguage(GetDetectedLanguage?.Language || SourceLanguage);
        SetTargetText(SourceText);
        (GetDetectedLanguage?.Language) && (SetDetectedLanguage({}));
    }, [GetLanguagePositionWasExchanged]);

    useEffect(() => {
        return () => {
            SetSourceText('');
            SetSourceLanguage('');
            SetTargetText('');
            SetLanguagePositionWasExchanged(false);
            SetTargetLanguage('');
            SetDetectedLanguage({});
            SetIsTranslationLoading(false);
            SetIsComponentMounted(false);
            SetAvailableTargetLanguages([]);
        };
    }, []);

    return (
        <section id='Translator-Box'>
            {((GetIsTranslatorSettingsLoading && !(Object.keys(GetTranslatorSettings).length)) ||
                (GetIsOperativeLanguagesLoading && !(Object.keys(GetAvailablesLanguages).length))) ? (
                <FormSkeleton />
            ) : (
                <form onSubmit={HandleFormSubmit}>
                    <Fade clear bottom>
                        <article id='Translation-Option-Box'>
                            <LanguageSelection
                                Label='From'
                                Getter={GetSourceLanguage}
                                Setter={SetSourceLanguage}
                                Items={GetAvailablesLanguages}
                                Default={{
                                    Value: 'auto',
                                    Content: (GetDetectedLanguage?.Language) ? (`${ISO6391.getName(GetDetectedLanguage.Language)} - Auto Detected (${GetDetectedLanguage.Confidence}%)`) : ('Detect Language')
                                }} />
                            
                            <IconButton 
                                id='Exchange-Languages-Icon-Box'
                                disabled={(!GetTargetText)}
                                onClick={() => SetLanguagePositionWasExchanged(true)}
                            >
                                <CgArrowsExchange />
                            </IconButton>
                            
                            <LanguageSelection
                                Label='To'
                                Getter={GetTargetLanguage}
                                Setter={SetTargetLanguage}
                                Items={GetAvailableTargetLanguages} />
                        </article>
                    </Fade>
                    
                    <article id='Translation-Result-Box'>
                        <Fade bottom>
                            <div>
                                <TextField
                                    fullWidth={true}
                                    placeholder="Let's start the marches, what do you want to translate today?"
                                    value={GetSourceText}
                                    onChange={(Event) => SetSourceText(Event.target.value)}
                                    inputProps={{
                                        maxLength: GetTranslatorSettings.CharacterLimit
                                    }}
                                    multiline
                                    minRows={8}
                                    maxRows={8}
                                />
                                
                                <Controls 
                                    Disabled={((GetSourceLanguage === 'auto' && !GetDetectedLanguage?.Language) || !GetSourceText.length)}
                                    Language={GetDetectedLanguage?.Language || GetSourceLanguage}
                                    Getter={GetSourceText} 
                                    Setter={SetSourceText} 
                                    For='Source' />
                            </div>
                        </Fade>
                        
                        {((GetTargetText.length >= 1 && Width <= 768) || (Width > 768)) && (
                            <Fade top>
                                <div>
                                    <TextField
                                        fullWidth={true}
                                        placeholder={(GetIsTranslationLoading) ? ("Translating, please be patient, our server is processing your request...") : ("In this box will be the result of your translation, you haven't translated anything yet, what are you waiting for?")}
                                        value={GetTargetText}
                                        onChange={(Event) => SetTargetText(Event.target.value)}
                                        multiline
                                        disabled={true}
                                        minRows={8}
                                        maxRows={8}
                                    />

                                    <Controls 
                                        Disabled={(!GetTargetText.length)}
                                        For='Target' 
                                        Getter={GetTargetText} 
                                        Language={GetTargetLanguage} />
                                </div>
                            </Fade>
                        )}
                    </article>
                    
                    <article>
                        <Fade bottom>
                            {(GetIsTranslationLoading) ? (
                                <Loader />
                            ) : (
                                <Button 
                                    disabled={(!GetSourceText.length) || (!GetSourceLanguage.length) || (!GetTargetLanguage.length)}
                                    variant='outlined'
                                    fullWidth={(Width <= 768)} 
                                    type='submit'>Translate</Button>
                            )}
                        </Fade>
                    </article>
                </form>
            )}
        </section>
    );
};

export default Form;